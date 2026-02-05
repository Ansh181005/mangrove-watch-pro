import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not logged in, go to login
  if (!user) {
    return <Navigate to="/admin_login" state={{ from: location }} replace />;
  }

  // If logged in but not admin, go to user dashboard (or 403 page)
  if (!isAdmin) {
      // Prevent infinite redirect loops if the login page sends non-admins here
     return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
};
