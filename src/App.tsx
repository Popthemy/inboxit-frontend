import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { IntegrationsProvider } from "@/contexts/IntegrationContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";

// Public Pages
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResendOTP from "./pages/ResendOTP";
import ResetPassword from "./pages/ResetPassword";
import Documentation from "./pages/Documentation";
import Changelog from "./pages/Changelog";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import Integrations from "./pages/Integrations";
import Messages from "./pages/Messages";
import MessageDetail from "./pages/MessageDetail";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
            <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
            <Route path="/verify-otp" element={<PublicLayout><VerifyOTP /></PublicLayout>} />
            <Route path="/resend-otp" element={<PublicLayout><ResendOTP /></PublicLayout>} />
            <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />
            <Route path="/docs" element={<PublicLayout><Documentation /></PublicLayout>} />
            <Route path="/changelog" element={<PublicLayout><Changelog /></PublicLayout>} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Dashboard Routes (Protected) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            
            <Route path="/integrations" element={
              <ProtectedRoute><DashboardLayout>
                <IntegrationsProvider>
                    <Integrations />
                </IntegrationsProvider>
                </DashboardLayout></ProtectedRoute>} />
          
            <Route path="/messages" element={<ProtectedRoute><DashboardLayout><Messages /></DashboardLayout></ProtectedRoute>} />
            <Route path="/messages/:id" element={<ProtectedRoute><DashboardLayout><MessageDetail /></DashboardLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><Analytics /></DashboardLayout></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><Notifications /></DashboardLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
