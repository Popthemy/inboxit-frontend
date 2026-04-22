import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Plug,
  MessageSquare,
  BarChart3,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  History,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Integrations", url: "/integrations", icon: Plug },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Documentation", url: "/docs", icon: FileText },
  { title: "Changelog", url: "/changelog", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-primary-foreground font-bold text-sm">
              IB
            </span>
          </motion.div>
          {!collapsed && (
            <motion.span
              className="font-bold text-lg text-sidebar-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Inboxit
            </motion.span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                        )}
                      >
                        <item.icon
                          className={cn("h-5 w-5", isActive && "text-primary")}
                        />
                        {!collapsed && <span>{item.title}</span>}
                        {isActive && !collapsed && (
                          <motion.div
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                            layoutId="activeIndicator"
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Section */}
      <div className="mt-auto border-t border-sidebar-border">
        {!collapsed && user && (
          <div className="p-4 space-y-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary text-xs font-bold">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        )}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Sidebar>
  );
}
