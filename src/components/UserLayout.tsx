import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  MapPin,
  Trophy,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
  { name: "Report Incident", href: "/user/report", icon: PlusCircle },
  { name: "My Reports", href: "/user/reports", icon: FileText },
  { name: "Community", href: "/user/community", icon: MapPin },
  { name: "Achievements", href: "/user/achievements", icon: Trophy },
  { name: "Profile", href: "/user/profile", icon: User },
];

export const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, logout, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold">Mangrove Watch</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User Profile Summary */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            
            {isAdmin && (
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2 mb-2 text-primary font-semibold hover:text-primary hover:bg-primary/10 transition-colors"
                asChild
              >
                <NavLink to="/admin_dashboard">
                  <Shield className="h-4 w-4" />
                  Admin Dashboard
                </NavLink>
              </Button>
            )}

            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:pl-64 min-h-screen">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-6 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <span className="font-semibold">Mangrove Watch</span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
