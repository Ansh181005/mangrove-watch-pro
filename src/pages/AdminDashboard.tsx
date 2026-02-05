import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Users, TrendingUp, TrendingDown, Eye } from "lucide-react";
import { IncidentTrends } from '@/components/IncidentTrends';

const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend 
}: {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend?: 'up' | 'down';
}) => (
  <Card className="hover:shadow-ocean transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {trend === 'up' && <TrendingUp className="h-3 w-3 text-status-success" />}
        {trend === 'down' && <TrendingDown className="h-3 w-3 text-destructive" />}
        {description}
      </div>
    </CardContent>
  </Card>
);

const RecentIncident = ({ 
  id, 
  type, 
  location, 
  status, 
  time 
}: {
  id: string;
  type: string;
  location: string;
  status: 'resolved' | 'investigating' | 'new';
  time: string;
}) => {
  const statusColors = {
    resolved: 'text-status-success bg-status-success/10',
    investigating: 'text-status-warning bg-status-warning/10',
    new: 'text-destructive bg-destructive/10',
    dismissed: 'text-muted-foreground bg-muted'
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">{type}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status] || statusColors.new}`}>
          {status}
        </span>
        <p className="text-xs text-muted-foreground mt-1">{time}</p>
      </div>
    </div>
  );
};

const TopContributor = ({ 
  name, 
  points 
}: {
  name: string;
  points: number;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg border border-border">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Users className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">Leading Contributor</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-accent">{points} pts</p>
    </div>
  </div>
);

export const AdminDashboard = () => {
    const [stats, setStats] = useState({
        newIncidents: 0,
        resolved: 0,
        activeContributors: 0,
        areas: 8 // Mock for now
    });
    const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
    const [topContributors, setTopContributors] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch stats (incidents)
            const { count: newCount } = await supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'new');
            const { count: resolvedCount } = await supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'resolved');
            
            // Fetch stats (users)
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

            // Fetch recent incidents
            const { data: incidents } = await supabase
                .from('incidents')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);
            
            // Fetch top contributors
            const { data: contributors } = await supabase
                .from('profiles')
                .select('*')
                .order('points', { ascending: false })
                .limit(4);

            if (incidents) {
                setRecentIncidents(incidents.map(i => ({
                    id: i.id,
                    type: i.type,
                    location: i.location,
                    status: i.status,
                    time: new Date(i.created_at).toLocaleDateString()
                })));
            }

            if (contributors) {
                setTopContributors(contributors.map(c => ({
                    name: c.full_name || 'Anonymous',
                    points: c.points || 0
                })));
            }

            setStats(prev => ({
                ...prev,
                newIncidents: newCount || 0,
                resolved: resolvedCount || 0,
                activeContributors: userCount || 0,
            }));
        };
        fetchData();
    }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Executive Overview</h1>
        <p className="text-muted-foreground">Mangrove surveillance system dashboard</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="New Incidents"
          value={stats.newIncidents.toString()}
          description="Requires attention"
          icon={AlertTriangle}
          trend="up"
        />
        <MetricCard
          title="Resolved Cases"
          value={stats.resolved.toString()}
          description="Total resolved"
          icon={CheckCircle}
          trend="up"
        />
        <MetricCard
          title="Active Contributors"
          value={stats.activeContributors.toString()}
          description="Total users"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Areas Monitored"
          value={stats.areas.toString()}
          description="Across monitored zones"
          icon={Eye}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Incidents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Recent Incidents
            </CardTitle>
            <CardDescription>
              Latest reported incidents requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentIncidents.length > 0 ? (
                recentIncidents.map((incident) => (
                <RecentIncident key={incident.id} {...incident} />
                ))
            ) : (
                <div className="text-sm text-muted-foreground">No recent incidents found.</div>
            )}
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Contributors
            </CardTitle>
            <CardDescription>
              Most active community members and organizations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topContributors.length > 0 ? (
                topContributors.map((contributor, index) => (
                <TopContributor key={index} {...contributor} />
                ))
            ) : (
                <div className="text-sm text-muted-foreground">No contributors found yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Incident Trends */}
      <Card>
        <CardContent>
          <IncidentTrends />
        </CardContent>
      </Card>
    </div>
  );
};