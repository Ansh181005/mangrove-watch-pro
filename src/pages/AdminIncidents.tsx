import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  MapPin, 
  Calendar,
  User,
  ChevronDown
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Incident {
  id: string;
  type: string;
  location: string;
  reporter: string;
  date: string;
  time: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

const mockIncidents: Incident[] = [
  {
    id: 'INC-2024-001',
    type: 'Illegal Logging',
    location: 'Mangrove Sector A-7',
    reporter: 'Marine Bio NGO',
    date: '2024-01-15',
    time: '14:30',
    status: 'new',
    severity: 'high',
    description: 'Large-scale tree cutting observed in protected zone'
  },
  {
    id: 'INC-2024-002',
    type: 'Unauthorized Fishing',
    location: 'Coastal Zone B-12',
    reporter: 'Local Fisherman',
    date: '2024-01-14',
    time: '08:15',
    status: 'investigating',
    severity: 'medium',
    description: 'Commercial fishing nets found in restricted breeding area'
  },
  {
    id: 'INC-2024-003',
    type: 'Pollution Discharge',
    location: 'River Delta C-3',
    reporter: 'EcoGuardians',
    date: '2024-01-13',
    time: '16:45',
    status: 'resolved',
    severity: 'critical',
    description: 'Industrial waste discharge affecting water quality'
  },
  {
    id: 'INC-2024-004',
    type: 'Wildlife Poaching',
    location: 'Protected Area D-9',
    reporter: 'Coastal Watch',
    date: '2024-01-12',
    time: '22:20',
    status: 'investigating',
    severity: 'high',
    description: 'Evidence of bird trapping and habitat destruction'
  },
  {
    id: 'INC-2024-005',
    type: 'Land Reclamation',
    location: 'Mangrove Sector E-4',
    reporter: 'Community Leader',
    date: '2024-01-11',
    time: '10:30',
    status: 'dismissed',
    severity: 'low',
    description: 'Small-scale unauthorized landfill in mangrove area'
  }
];

const StatusBadge = ({ status }: { status: Incident['status'] }) => {
  const variants = {
    new: 'bg-destructive/10 text-destructive border-destructive/20',
    investigating: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    resolved: 'bg-status-success/10 text-status-success border-status-success/20',
    dismissed: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const SeverityBadge = ({ severity }: { severity: Incident['severity'] }) => {
  const variants = {
    low: 'bg-status-info/10 text-status-info border-status-info/20',
    medium: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    high: 'bg-reef-orange/10 text-reef-orange border-reef-orange/20',
    critical: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <Badge variant="outline" className={variants[severity]}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

export const AdminIncidents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [incidents] = useState<Incident[]>(mockIncidents);
  const [sortBy, setSortBy] = useState<string>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || incident.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Incident Management</h1>
        <p className="text-muted-foreground">Monitor and manage all reported incidents</p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                All Incidents
              </CardTitle>
              <CardDescription>
                {filteredIncidents.length} incidents found
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <Button
                variant="outline"
                onClick={() => setFilterStatus(filterStatus === 'all' ? 'new' : 'all')}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Location</TableHead>
                  <TableHead className="font-semibold">Reporter</TableHead>
                  <TableHead className="font-semibold">Date/Time</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Severity</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.map((incident) => (
                  <TableRow key={incident.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{incident.id}</TableCell>
                    <TableCell className="font-medium">{incident.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {incident.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        {incident.reporter}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {incident.date} {incident.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={incident.status} />
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={incident.severity} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">
                {incidents.filter(i => i.status === 'new').length}
              </p>
              <p className="text-sm text-muted-foreground">New</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-status-warning">
                {incidents.filter(i => i.status === 'investigating').length}
              </p>
              <p className="text-sm text-muted-foreground">Investigating</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-status-success">
                {incidents.filter(i => i.status === 'resolved').length}
              </p>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                {incidents.filter(i => i.status === 'dismissed').length}
              </p>
              <p className="text-sm text-muted-foreground">Dismissed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};