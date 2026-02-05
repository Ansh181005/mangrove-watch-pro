import { useEffect, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminLogin = () => {
  const { user, login, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  if (user) {
      if (isAdmin) {
          return <Navigate to="/admin_dashboard" replace />;
      } else {
          return <Navigate to="/user/dashboard" replace />;
      }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
        toast({
            title: "Validation Error",
            description: "Please enter both email and password.",
            variant: "destructive"
        });
        setIsLoading(false);
        return;
    }

    const { error } = await login(formData.email, formData.password);

    if (error) {
       toast({
         title: "Login Failed",
         description: error.message,
         variant: "destructive"
       });
    } else {
       toast({
         title: "Login Successful",
         description: "Welcome back.",
       });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mangrove p-4">
      <button
        type="button"
        onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/home')}
        className="absolute top-6 left-6 z-20 px-4 py-2 rounded bg-card/80 text-foreground border border-border shadow hover:bg-card"
      >
        ← Back
      </button>
      <div className="absolute inset-0 bg-gradient-mangrove opacity-90" />
      <div className="absolute inset-0">
        <Waves className="absolute top-1/4 left-1/4 h-32 w-32 text-ocean-light/20 animate-pulse" />
        <Waves className="absolute bottom-1/3 right-1/3 h-24 w-24 text-ocean-medium/30 animate-pulse delay-1000" />
      </div>
      
      <Card className="relative z-10 w-full max-w-md bg-card/95 backdrop-blur-sm border-border shadow-mangrove">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
              <div className="flex flex-col text-left">
                <span className="text-lg font-bold text-foreground">Mangrove</span>
                <span className="text-xs text-muted-foreground">Surveillance</span>
              </div>
            </div>
          </div>

  
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
  
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-primary hover:bg-primary/90" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Don't have an  account?{" "}
              <Link to="/admin_signup" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      
      <div className="absolute bottom-4 text-center text-xs text-white/50">
        © 2026 Mangrove Watch Pro. Protected Area.
      </div>
    </div>
  );
};
