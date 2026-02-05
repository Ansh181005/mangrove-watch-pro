import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, Trophy, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const UserDashboard = () => {
    const { profile } = useAuth();
    
    // Mock user stats - in a real app, fetch these from Supabase
    const stats = [
        { title: "My Reports", value: "12", icon: FileText, description: "Total incidents reported" },
        { title: "Impact Score", value: "850", icon: Trophy, description: "Points earned for contributions" },
        { title: "Active Areas", value: "3", icon: MapPin, description: "Locations monitored" },
    ];
    
    const recentActivity = [
        { id: 1, action: "Reported illegal logging", location: "Mangrove Sector A", date: "2 days ago", status: "Investigating" },
        { id: 2, action: "Verified report", location: "Coastal Zone B", date: "5 days ago", status: "Resolved" },
        { id: 3, action: "Upload evidence photos", location: "River Delta C", date: "1 week ago", status: "New" },
    ];
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h2>
                    <p className="text-muted-foreground">Here's an overview of your eco-contributions.</p>
                </div>
                <Button asChild>
                    <Link to="/user/report">
                        <Plus className="mr-2 h-4 w-4" />
                        New Report
                    </Link>
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your latest contributions to Mangrove Watch
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">{activity.location} • {activity.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${activity.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                                              activity.status === 'Investigating' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="col-span-3">
                    {/* Community Leaderboard removed */}
            </div>
        </div>
    );
};
