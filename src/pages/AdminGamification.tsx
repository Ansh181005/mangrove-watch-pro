import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Trophy, 
  Crown, 
  Loader2,
  Plus,
  Search,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  full_name: string;
  email?: string;
  type: string;
  points: number;
  tier: string;
  avatar_url?: string;
}

export const AdminGamification = () => {
    const { toast } = useToast();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Points Assignment State
    const [open, setOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
    const [pointsToAward, setPointsToAward] = useState("");
    const [reason, setReason] = useState("");
    const [allUsers, setAllUsers] = useState<LeaderboardEntry[]>([]);
    const [isAwarding, setIsAwarding] = useState(false);

    useEffect(() => {
        fetchLeaderboard();
        fetchAllUsers();
    }, []);

    const fetchLeaderboard = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, type, points, tier, avatar_url')
            .order('points', { ascending: false })
            .limit(10);
        
        if (!error && data) {
            setLeaderboard(data);
        }
        setLoading(false);
    };

    const fetchAllUsers = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .order('full_name');
        if (data) setAllUsers(data);
    };

    const handleAwardPoints = async () => {
        if (!selectedUser || !pointsToAward) return;
        
        setIsAwarding(true);
        const amount = parseInt(pointsToAward);

        try {
            // Using RPC function (ensure calls update_policies.sql to create this)
            const { error } = await supabase.rpc('increment_points', {
                user_id: selectedUser.id,
                amount: amount
            });

            if (error) {
                // Fallback for direct update if RPC doesn't exist
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ points: (selectedUser.points || 0) + amount })
                    .eq('id', selectedUser.id);
                
                if (updateError) throw updateError;
            }

            toast({
                title: "Points Awarded",
                description: `Successfully added ${amount} points to ${selectedUser.full_name}.`,
            });
            
            setOpen(false);
            setPointsToAward("");
            setSelectedUser(null);
            setReason("");
            fetchLeaderboard(); // Refresh list

        } catch (error: any) {
             toast({
                title: "Error",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsAwarding(false);
        }
    };

    const getMedalColor = (index: number) => {
        switch (index) {
        case 0: return 'text-yellow-500 fill-yellow-500';
        case 1: return 'text-gray-400 fill-gray-400';
        case 2: return 'text-amber-600 fill-amber-600';
        default: return 'text-muted-foreground';
        }
    };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gamification & Rewards</h1>
          <p className="text-muted-foreground">Manage user engagement, points, and tiered rewards.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Award Points
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Award Points to User</DialogTitle>
                    <DialogDescription>
                        Manually assign points for special contributions or corrections.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Select User</Label>
                        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={searchOpen}
                                    className="w-full justify-between"
                                >
                                    {selectedUser ? selectedUser.full_name || selectedUser.email : "Search user..."}
                                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search user..." />
                                    <CommandList>
                                        <CommandEmpty>No user found.</CommandEmpty>
                                        <CommandGroup>
                                            {allUsers.map((user) => (
                                                <CommandItem
                                                    key={user.id}
                                                    value={user.full_name || user.email || ''}
                                                    onSelect={() => {
                                                        setSelectedUser(user);
                                                        setSearchOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{user.full_name}</span>
                                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>Points Amount</Label>
                        <Input 
                            type="number" 
                            placeholder="e.g. 50" 
                            value={pointsToAward}
                            onChange={(e) => setPointsToAward(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Reason (Optional)</Label>
                        <Input 
                            placeholder="e.g. Community Cleanup Event" 
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAwardPoints} disabled={isAwarding || !selectedUser || !pointsToAward}>
                        {isAwarding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Award
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points Awarded</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {/* Mock data for total points */}
            <div className="text-2xl font-bold">
                {leaderboard.reduce((acc, curr) => acc + (curr.points || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across {leaderboard.length} top users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Global Leaderboard */}
        <Card className="md:col-span-4 max-h-[600px] overflow-hidden flex flex-col">
          <CardHeader>
            <CardTitle>Top Contributors</CardTitle>
            <CardDescription>Highest ranking guardians this month</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
             {loading ? (
                 <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
             ) : (
                <div className="divide-y divide-border">
                {leaderboard.map((user, index) => (
                    <div key={user.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 w-8 text-center font-bold text-lg">
                        {index < 3 ? (
                        <Crown className={`h-6 w-6 mx-auto ${getMedalColor(index)}`} />
                        ) : (
                        <span className="text-muted-foreground">#{index + 1}</span>
                        )}
                    </div>
                    
                    <Avatar className="h-10 w-10 border-2 border-border">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>{user.full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.full_name || 'Anonymous User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.type}</p>
                    </div>
                    
                    <div className="text-right">
                        <div className="font-bold">{user.points || 0} pts</div>
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">{user.tier || 'Bronze'}</Badge>
                    </div>
                    </div>
                ))}
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
