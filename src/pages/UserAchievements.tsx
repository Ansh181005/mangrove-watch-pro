import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Shield, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const UserAchievements = () => {
    const { profile } = useAuth();
    
    const achievements = [
        { title: "First Reporter", description: "Submitted your first incident report", locked: false, icon: Star },
        { title: "Eco Warrior", description: "Reached 1000 impact points", locked: true, icon: Trophy },
        { title: "Guardian", description: "Verified 5 incidents", locked: true, icon: Shield },
        { title: "Expert Observer", description: "Submitted 10 high-quality reports", locked: false, icon: Target },
        { title: "Community Pillar", description: "Received 50 helpful votes", locked: true, icon: Award },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8 items-center bg-primary/5 p-8 rounded-xl">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-background">
                        <Trophy className="h-16 w-16 text-yellow-500" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                        Level 5
                    </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold">Current Standing: {profile?.tier || 'Bronze'}</h2>
                        <p className="text-muted-foreground">You are 150 points away from Silver tier</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{profile?.points || 0} pts</span>
                            <span>1000 pts</span>
                        </div>
                        <Progress value={((profile?.points || 0) / 1000) * 100} className="h-3" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">Badges & Achievements</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((achievement, idx) => (
                        <Card key={idx} className={achievement.locked ? "opacity-60 bg-muted/50" : ""}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <div className={`p-2 rounded-full ${achievement.locked ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                                    <achievement.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-base">{achievement.title}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{achievement.description}</CardDescription>
                                {achievement.locked && (
                                    <Badge variant="secondary" className="mt-2">Locked</Badge>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
