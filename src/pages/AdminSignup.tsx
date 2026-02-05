import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminSignup = () => {
  const { user, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (user) {
    return <Navigate to="/admin_dashboard" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.email || !formData.password || !formData.name) {
        toast({
            title: "Validation Error",
            description: "Please fill in all fields.",
            variant: "destructive"
        });
        setIsLoading(false);
        return;
    }

    const { error } = await signup(formData.email, formData.password, formData.name);

    if (error) {
        toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
        toast({
        title: "Account Created",
        description: "Welcome! Please check your email to confirm your account.",
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
          <CardTitle className="text-2xl font-bold text-foreground">
            Create Account
          </CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@mangrove.org" 
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-mangrove transition-all duration-300"
                size="lg"
            >
                {isLoading ? (
                <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    Creating account...
                </div>
                ) : (
                "Sign Up"
                )}
            </Button>
            
            <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/admin_login" className="text-primary hover:underline font-medium">
                Sign in
                </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
