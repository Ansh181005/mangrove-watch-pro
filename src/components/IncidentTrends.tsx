import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface IncidentRow {
  id: string;
  created_at: string;
  status: string;
}

interface WeeklyPoint {
  week: string;
  reports: number;
  resolved: number;
}

function getWeekKey(date: Date): string {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = tmp.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  tmp.setUTCDate(tmp.getUTCDate() + diff);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + yearStart.getUTCDay() + 1) / 7);
  const yyyy = tmp.getUTCFullYear();
  const ww = String(weekNo).padStart(2, "0");
  return `${yyyy}-W${ww}`;
}

function getWeeksRange(count: number): string[] {
  const weeks: string[] = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i * 7);
    weeks.push(getWeekKey(d));
  }
  return weeks;
}

export function IncidentTrends() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IncidentRow[]>([]);
  const WEEKS = 12; // last 12 weeks

  const fetchIncidents = async () => {
    setLoading(true);
    const start = new Date();
    start.setDate(start.getDate() - WEEKS * 7);

    const { data, error } = await supabase
      .from("incidents")
      .select("id, created_at, status")
      .gte("created_at", start.toISOString());

    if (error) {
      console.error("Failed to load incidents", error);
      setLoading(false);
      return;
    }
    setRows((data as IncidentRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();

    const channel = supabase
      .channel("incidents-trends")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        () => {
          fetchIncidents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const data: WeeklyPoint[] = useMemo(() => {
    const weeks = getWeeksRange(WEEKS);
    const bucket: Record<string, { reports: number; resolved: number }> = {};
    weeks.forEach((w) => (bucket[w] = { reports: 0, resolved: 0 }));

    for (const r of rows) {
      const d = new Date(r.created_at);
      const wk = getWeekKey(d);
      if (!bucket[wk]) bucket[wk] = { reports: 0, resolved: 0 };
      bucket[wk].reports += 1;
      if (r.status === "resolved") bucket[wk].resolved += 1;
    }

    return weeks.map((w) => ({
      week: w,
      reports: bucket[w]?.reports || 0,
      resolved: bucket[w]?.resolved || 0,
    }));
  }, [rows]);

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2">Incident Trends Over Time</CardTitle>
        <CardDescription>Weekly incident reports and resolution counts</CardDescription>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
              tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip content={({ active, payload, label }) => {
              if (!active || !payload || payload.length === 0) return null;
              const reports = payload.find(p => p.dataKey === 'reports')?.value ?? 0;
              const resolved = payload.find(p => p.dataKey === 'resolved')?.value ?? 0;
              return (
                <div className="rounded-md border bg-background p-3 shadow-sm">
                  <div className="text-xs text-foreground font-medium">{label}</div>
                  <div className="mt-2 text-sm text-blue-600">Reports : {reports}</div>
                  <div className="text-sm text-green-600">Resolved : {resolved}</div>
                </div>
              );
            }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="reports" stroke="#2563eb" name="Reports" strokeWidth={2} dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="resolved" stroke="#16a34a" name="Resolved" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {loading && (
        <p className="text-xs text-muted-foreground mt-2">Loading latest trends…</p>
      )}
    </div>
  );
}

export default IncidentTrends;