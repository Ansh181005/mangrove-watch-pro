import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { AdminLayout } from "@/components/AdminLayout";
import { UserLayout } from "@/components/UserLayout";


// Pages
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminSignup } from "@/pages/AdminSignup";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminIncidents } from "@/pages/AdminIncidents";
import { AdminUsers } from "@/pages/AdminUsers";
import { AdminGamification } from "@/pages/AdminGamification";
import { AdminSettings } from "@/pages/AdminSettings";
// User Pages
import { UserDashboard } from "@/pages/UserDashboard";
import { ReportIncident } from "@/pages/ReportIncident";
import { UserReports } from "@/pages/UserReports";
import { UserProfile } from "@/pages/UserProfile";

import { UserAchievements } from "@/pages/UserAchievements";
import NotFound from "./pages/NotFound";
import Home from "@/pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Redirect to /home on first load */}
          {window.location.pathname === '/' && <Navigate to="/home" replace />}
          <Routes>
            {/* Public Route */}
            <Route path="/admin_login" element={<AdminLogin />} />
            <Route path="/admin_signup" element={<AdminSignup />} />
            <Route path="/home" element={<Home />} />
            
            {/* Protected Routes with Admin Layout */}
            <Route path="/" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Navigate to="/admin_dashboard" replace />} />
              <Route path="admin_dashboard" element={<AdminDashboard />} />
              <Route path="admin_incidents" element={<AdminIncidents />} />
              <Route path="admin_users" element={<AdminUsers />} />
              <Route path="admin_gamification" element={<AdminGamification />} />
              <Route path="admin_settings" element={<AdminSettings />} />
            </Route>
            
            {/* Protected Routes with User Layout */}
            <Route path="/user" element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }>
              <Route index element={<UserDashboard />} />
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="report" element={<ReportIncident />} />
              <Route path="reports" element={<UserReports />} />
              <Route path="achievements" element={<UserAchievements />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
