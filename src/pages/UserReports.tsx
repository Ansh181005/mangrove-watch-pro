import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const UserReports = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        
        const fetchReports = async () => {
            try {
                const { data, error } = await supabase
                    .from('incidents')
                    .select('*')
                    .eq('reporter_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                setReports(data || []);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [user]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'resolved': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'investigating': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'dismissed': return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
            default: return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Reports</h1>
                <p className="text-muted-foreground">Track the status of incidents you've reported.</p>
            </div>

            {reports.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No reports found</h3>
                        <p className="text-muted-foreground">You haven't reported any incidents yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                        <Card key={report.id} className="overflow-hidden bg-card">
                            <CardHeader className="bg-muted/30 pb-3">
                                <div className="flex justify-between items-start gap-2">
                                    <Badge variant="outline" className={getStatusColor(report.status)}>
                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <CardTitle className="text-lg mt-2 truncate" title={report.type}>{report.type}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {report.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm line-clamp-3 text-muted-foreground">
                                    {report.description}
                                </p>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs">
                                    <span className="font-medium">Severity:</span>
                                    <span className={`px-2 py-0.5 rounded-full ${
                                        report.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                        report.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                        report.severity === 'medium' ? 'bg-yellow-50 text-yellow-800' :
                                        'bg-green-50 text-green-800'
                                    }`}>
                                        {report.severity.toUpperCase()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
