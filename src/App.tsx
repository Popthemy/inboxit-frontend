import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { IntegrationsProvider } from "@/contexts/IntegrationContext";
import { MessageProvider } from "@/contexts/MessageContext";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DocsLayout } from "@/components/layout/DocsLayout";

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
            <Route
              path="/"
              element={
                <PublicLayout>
                  <Landing />
                </PublicLayout>
              }
            />
            <Route
              path="/pricing"
              element={
                <PublicLayout>
                  <Pricing />
                </PublicLayout>
              }
            />
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicLayout>
                  <Signup />
                </PublicLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicLayout>
                  <ForgotPassword />
                </PublicLayout>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PublicLayout>
                  <VerifyOTP />
                </PublicLayout>
              }
            />
            <Route
              path="/resend-otp"
              element={
                <PublicLayout>
                  <ResendOTP />
                </PublicLayout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicLayout>
                  <ResetPassword />
                </PublicLayout>
              }
            />
            <Route
              path="/docs"
              element={
                <DocsLayout>
                  <Documentation />
                </DocsLayout>
              }
            />
            <Route
              path="/changelog"
              element={
                <PublicLayout>
                  <Changelog />
                </PublicLayout>
              }
            />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Dashboard Routes (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <DashboardProvider>
                        <Dashboard />
                      </DashboardProvider>
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/integrations"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <IntegrationsProvider>
                        <Integrations />
                      </IntegrationsProvider>
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <MessageProvider>
                        <Messages />
                      </MessageProvider>
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:id"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <MessageProvider>
                        <MessageDetail />
                      </MessageProvider>
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <DashboardProvider>
                        <Analytics />
                      </DashboardProvider>
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <Notifications />
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <NotificationProvider>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </NotificationProvider>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
