import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Search, Filter, Eye, MapPin, Calendar, User, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";

interface Incident {
  id: string;
  type: string;
  location: string;
  reporter_name: string;
  created_at: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export const AdminIncidents = () => {
    const { toast } = useToast();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Fetch incidents
    const fetchIncidents = async () => {
        const { data, error } = await supabase
            .from('incidents')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to fetch incidents",
                variant: "destructive"
            });
        } else {
            setIncidents(data || []);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('incidents')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            toast({
                title: "Update Failed",
                description: "Could not update status",
                variant: "destructive"
            });
        } else {
            toast({
                title: "Status Updated",
                description: `Incident marked as ${newStatus}`,
            });
            fetchIncidents(); 
        }
    };

    const handleDeleteIncident = async (id: string) => {
        const { error } = await supabase
            .from('incidents')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: "Deletion Failed",
                description: error.message,
                variant: "destructive"
            });
        } else {
            toast({
                title: "Incident Deleted",
                description: "The report has been removed.",
            });
            fetchIncidents();
        }
    };

    const filteredIncidents = incidents.filter(incident => {
        const matchesSearch = incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              incident.reporter_name?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
          <p className="text-muted-foreground">Monitor and respond to environmental reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchIncidents}>
             Refresh Data
          </Button>
          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search details..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b border-border">
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Showing {filteredIncidents.length} incidents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Details</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No incidents found matching criteria.
                      </TableCell>
                  </TableRow>
              ) : (
                filteredIncidents.map((incident) => (
                    <TableRow key={incident.id} className="group">
                    <TableCell>
                        <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                            {incident.type}
                            <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 ${
                                incident.severity === 'critical' ? 'border-red-500 text-red-500' : 
                                incident.severity === 'high' ? 'border-orange-500 text-orange-500' : ''
                            }`}>
                                {incident.severity}
                            </Badge>
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={incident.description}>
                            {incident.description}
                        </span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {incident.location}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{incident.reporter_name}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Select 
                                defaultValue={incident.status} 
                                onValueChange={(val) => handleStatusUpdate(incident.id, val)}
                            >
                                <SelectTrigger className={`h-8 w-[130px] ${
                                    incident.status === 'resolved' ? 'border-green-200 bg-green-50 text-green-900' :
                                    incident.status === 'investigating' ? 'border-blue-200 bg-blue-50 text-blue-900' : ''
                                }`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="investigating">Investigating</SelectItem>
                                    <SelectItem value="resolved">Resolved (+50 pts)</SelectItem>
                                    <SelectItem value="dismissed">Dismissed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                       {/* Delete Button Only for Resolved Incidents */}
                        {incident.status === 'resolved' && (
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Incident?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete this report.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteIncident(incident.id)} className="bg-destructive hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </TableCell>
                    </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
