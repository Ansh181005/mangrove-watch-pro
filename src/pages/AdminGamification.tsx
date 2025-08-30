import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal, 
  Gift,
  TrendingUp,
  Users,
  Award,
  Zap
} from "lucide-react";

interface LeaderboardEntry {
  id: string;
  name: string;
  type: 'NGO' | 'Community' | 'Individual' | 'Government';
  points: number;
  reportsThisMonth: number;
  streak: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  avatar?: string;
}

interface RewardTier {
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
  icon: any;
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Marine Bio NGO',
    type: 'NGO',
    points: 3780,
    reportsThisMonth: 12,
    streak: 15,
    tier: 'Diamond'
  },
  {
    id: '2',
    name: 'EcoGuardians',
    type: 'NGO',
    points: 3240,
    reportsThisMonth: 9,
    streak: 22,
    tier: 'Platinum'
  },
  {
    id: '3',
    name: 'Ahmad Rahman',
    type: 'Community',
    points: 2890,
    reportsThisMonth: 8,
    streak: 8,
    tier: 'Gold'
  },
  {
    id: '4',
    name: 'Coastal Watch',
    type: 'Government',
    points: 2340,
    reportsThisMonth: 6,
    streak: 12,
    tier: 'Gold'
  },
  {
    id: '5',
    name: 'Dr. Sarah Chen',
    type: 'Individual',
    points: 1980,
    reportsThisMonth: 5,
    streak: 6,
    tier: 'Silver'
  }
];

const rewardTiers: RewardTier[] = [
  {
    name: 'Bronze',
    minPoints: 100,
    color: 'text-amber-600',
    benefits: ['Basic reporting tools', 'Community access'],
    icon: Medal
  },
  {
    name: 'Silver',
    minPoints: 500,
    color: 'text-gray-400',
    benefits: ['Advanced analytics', 'Priority support', 'Monthly reports'],
    icon: Award
  },
  {
    name: 'Gold',
    minPoints: 1500,
    color: 'text-yellow-500',
    benefits: ['Expert consultation', 'Data export', 'Training materials'],
    icon: Star
  },
  {
    name: 'Platinum',
    minPoints: 3000,
    color: 'text-blue-400',
    benefits: ['Direct hotline', 'Policy influence', 'Research collaboration'],
    icon: Crown
  },
  {
    name: 'Diamond',
    minPoints: 5000,
    color: 'text-cyan-400',
    benefits: ['VIP status', 'Conference invitations', 'Exclusive network'],
    icon: Trophy
  }
];

const TierBadge = ({ tier }: { tier: LeaderboardEntry['tier'] }) => {
  const colors = {
    Bronze: 'bg-amber-600/10 text-amber-600 border-amber-600/20',
    Silver: 'bg-gray-400/10 text-gray-400 border-gray-400/20',
    Gold: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Platinum: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    Diamond: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'
  };

  return (
    <Badge variant="outline" className={colors[tier]}>
      {tier}
    </Badge>
  );
};

const LeaderboardCard = ({ entry, rank }: { entry: LeaderboardEntry; rank: number }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <Card className={`hover:shadow-ocean transition-all duration-300 ${
      rank <= 3 ? 'ring-2 ring-primary/20' : ''
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10">
              {getRankIcon(rank)}
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={entry.avatar} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {entry.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">{entry.name}</h3>
              <p className="text-sm text-muted-foreground">{entry.type}</p>
            </div>
          </div>
          <TierBadge tier={entry.tier} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-accent" />
              <span className="font-bold text-accent">{entry.points}</span>
            </div>
            <p className="text-xs text-muted-foreground">Points</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp className="h-4 w-4 text-status-success" />
              <span className="font-bold text-status-success">{entry.reportsThisMonth}</span>
            </div>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
          
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="h-4 w-4 text-status-warning" />
              <span className="font-bold text-status-warning">{entry.streak}</span>
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RewardTierCard = ({ tier }: { tier: RewardTier }) => {
  const IconComponent = tier.icon;
  
  return (
    <Card className="hover:shadow-mangrove transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg bg-card ${tier.color}`}>
            <IconComponent className="h-6 w-6" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${tier.color}`}>{tier.name}</h3>
            <p className="text-sm text-muted-foreground">{tier.minPoints}+ points</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {tier.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-sm text-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export const AdminGamification = () => {
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'rewards'>('leaderboard');

  const totalParticipants = mockLeaderboard.length;
  const averagePoints = mockLeaderboard.reduce((sum, entry) => sum + entry.points, 0) / totalParticipants;
  const topPerformer = mockLeaderboard[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gamification & Rewards</h1>
        <p className="text-muted-foreground">Manage contributor incentives and recognition</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <p className="text-2xl font-bold text-primary">{totalParticipants}</p>
              </div>
              <p className="text-sm text-muted-foreground">Active Contributors</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="h-5 w-5 text-accent" />
                <p className="text-2xl font-bold text-accent">{Math.round(averagePoints)}</p>
              </div>
              <p className="text-sm text-muted-foreground">Avg Points</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <p className="text-2xl font-bold text-yellow-500">{topPerformer.points}</p>
              </div>
              <p className="text-sm text-muted-foreground">Top Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Gift className="h-5 w-5 text-reef-coral" />
                <p className="text-2xl font-bold text-reef-coral">5</p>
              </div>
              <p className="text-sm text-muted-foreground">Reward Tiers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={selectedTab === 'leaderboard' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('leaderboard')}
          className="flex items-center gap-2"
        >
          <Trophy className="h-4 w-4" />
          Leaderboard
        </Button>
        <Button
          variant={selectedTab === 'rewards' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('rewards')}
          className="flex items-center gap-2"
        >
          <Gift className="h-4 w-4" />
          Reward System
        </Button>
      </div>

      {/* Content */}
      {selectedTab === 'leaderboard' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top Contributors
              </CardTitle>
              <CardDescription>
                Current month's leading contributors and their achievements
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockLeaderboard.map((entry, index) => (
              <LeaderboardCard key={entry.id} entry={entry} rank={index + 1} />
            ))}
          </div>
        </div>
      )}

      {selectedTab === 'rewards' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Reward Tiers
              </CardTitle>
              <CardDescription>
                Recognition levels and benefits for community contributors
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rewardTiers.map((tier) => (
              <RewardTierCard key={tier.name} tier={tier} />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Manual Point Awards</CardTitle>
              <CardDescription>
                Award additional points for exceptional contributions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Select Contributor
                  </label>
                  <select className="w-full p-2 border border-border rounded-lg bg-background text-foreground">
                    <option>Choose a contributor...</option>
                    {mockLeaderboard.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Points
                  </label>
                  <input 
                    type="number" 
                    placeholder="100" 
                    className="w-full p-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Star className="h-4 w-4 mr-2" />
                  Award Points
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};