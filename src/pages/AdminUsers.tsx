import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  UserCheck, 
  UserX, 
  Star,
  MapPin,
  Calendar,
  Mail,
  Shield
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  type: 'NGO' | 'Community' | 'Individual' | 'Government';
  location: string;
  joinDate: string;
  totalReports: number;
  resolvedReports: number;
  points: number;
  status: 'active' | 'inactive' | 'banned';
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Marine Bio NGO',
    email: 'contact@marinebio.org',
    type: 'NGO',
    location: 'Jakarta, Indonesia',
    joinDate: '2023-03-15',
    totalReports: 45,
    resolvedReports: 38,
    points: 2340,
    status: 'active'
  },
  {
    id: 'USR-002',
    name: 'Ahmad Rahman',
    email: 'ahmad.r@email.com',
    type: 'Community',
    location: 'Surabaya, Indonesia',
    joinDate: '2023-06-20',
    totalReports: 28,
    resolvedReports: 22,
    points: 1560,
    status: 'active'
  },
  {
    id: 'USR-003',
    name: 'EcoGuardians',
    email: 'team@ecoguardians.org',
    type: 'NGO',
    location: 'Bangkok, Thailand',
    joinDate: '2023-01-10',
    totalReports: 67,
    resolvedReports: 59,
    points: 3780,
    status: 'active'
  },
  {
    id: 'USR-004',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    type: 'Individual',
    location: 'Singapore',
    joinDate: '2023-08-05',
    totalReports: 23,
    resolvedReports: 20,
    points: 1290,
    status: 'active'
  },
  {
    id: 'USR-005',
    name: 'Coastal Watch',
    email: 'info@coastalwatch.org',
    type: 'Government',
    location: 'Manila, Philippines',
    joinDate: '2023-02-28',
    totalReports: 34,
    resolvedReports: 31,
    points: 1980,
    status: 'inactive'
  }
];

const TypeBadge = ({ type }: { type: User['type'] }) => {
  const variants = {
    NGO: 'bg-primary/10 text-primary border-primary/20',
    Community: 'bg-ocean-medium/10 text-ocean-medium border-ocean-medium/20',
    Individual: 'bg-reef-coral/10 text-reef-coral border-reef-coral/20',
    Government: 'bg-status-info/10 text-status-info border-status-info/20'
  };

  return (
    <Badge variant="outline" className={variants[type]}>
      {type}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: User['status'] }) => {
  const variants = {
    active: 'bg-status-success/10 text-status-success border-status-success/20',
    inactive: 'bg-status-warning/10 text-status-warning border-status-warning/20',
    banned: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <Badge variant="outline" className={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const UserCard = ({ user }: { user: User }) => {
  const successRate = user.totalReports > 0 ? Math.round((user.resolvedReports / user.totalReports) * 100) : 0;

  return (
    <Card className="hover:shadow-ocean transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{user.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>
          </div>
          <StatusBadge status={user.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TypeBadge type={user.type} />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {user.location}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              Joined {user.joinDate}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 mb-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-bold text-accent">{user.points}</span>
              <span className="text-xs text-muted-foreground">pts</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {user.totalReports} reports • {successRate}% success
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <UserCheck className="h-4 w-4 mr-1" />
              View Profile
            </Button>
          </div>
          
          <div className="flex gap-1">
            {user.status === 'active' && (
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                <UserX className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Shield className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState<User[]>(mockUsers);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || user.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const totalPoints = users.reduce((sum, user) => sum + user.points, 0);
  const totalReports = users.reduce((sum, user) => sum + user.totalReports, 0);
  const activeUsers = users.filter(user => user.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage contributors and community members</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-status-success">{activeUsers}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{totalPoints.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-ocean-medium">{totalReports}</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Users
              </CardTitle>
              <CardDescription>
                {filteredUsers.length} users found
              </CardDescription>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'NGO', 'Community', 'Individual', 'Government'].map((type) => (
                  <Button
                    key={type}
                    variant={filterType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(type)}
                  >
                    {type === 'all' ? 'All' : type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};