import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Waves } from 'lucide-react';

export const AdminLogin = () => {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/admin_dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    // Mock Google Sign-in - replace with actual implementation
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'Admin User',
        email: 'admin@mangrove.org',
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      };
      
      login(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-mangrove p-4">
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
            Admin Access
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access the mangrove surveillance dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-mangrove transition-all duration-300"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </div>
            )}
          </Button>
          
          <div className="text-center text-xs text-muted-foreground">
            Only authorized personnel can access the surveillance system
          </div>
        </CardContent>
      </Card>
    </div>
  );
};