import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
import Documentation from "./pages/Documentation";
import Changelog from "./pages/Changelog";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import APIKeys from "./pages/APIKeys";
import Routes_ from "./pages/Routes";
import Messages from "./pages/Messages";
import MessageDetail from "./pages/MessageDetail";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import OnTop from "./components/common/onTop";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <OnTop /> 
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
            <Route path="/pricing" element={<PublicLayout><Pricing /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />
            <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
            <Route path="/docs" element={<PublicLayout><Documentation /></PublicLayout>} />
            <Route path="/changelog" element={<PublicLayout><Changelog /></PublicLayout>} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Dashboard Routes (Protected) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/api-keys" element={<ProtectedRoute><DashboardLayout><APIKeys /></DashboardLayout></ProtectedRoute>} />
            <Route path="/routes" element={<ProtectedRoute><DashboardLayout><Routes_ /></DashboardLayout></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><DashboardLayout><Messages /></DashboardLayout></ProtectedRoute>} />
            <Route path="/messages/:id" element={<ProtectedRoute><DashboardLayout><MessageDetail /></DashboardLayout></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><Analytics /></DashboardLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout><Profile /></DashboardLayout></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      <OnTop/>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
