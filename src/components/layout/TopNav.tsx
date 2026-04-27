import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Plus,
  Send,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { formatDistanceToNow } from "date-fns";
import { SendTestDialog } from "@/components/dashboard/SendTestDialog";
import { useNotifications } from "@/contexts/useNotifications";
import { typeConfig, routeMap } from "@/utils/notificationUtils";

export function TopNav() {
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("light");
  };

  const handleNotificationClick = async (notification: any) => {
    await markAsRead(notification.id);
    const pathFn = routeMap[notification.type];
    if (pathFn) {
      navigate(pathFn(notification.objectId));
    }
  };

  // Show only the first 5 notifications in the dropdown
  const recentNotifications = notifications.slice(0, 5);

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <SearchBar
            placeholder="Search anything... (⌘K)"
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-64 hidden sm:block"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Action</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/onboarding")}>
                <Plus className="mr-2 h-4 w-4" />
                Create API Key
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTestDialogOpen(true)}>
                <Send className="mr-2 h-4 w-4" />
                Send Test Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <span className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </span>
              </div>
              <DropdownMenuSeparator />
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notification) => {
                  const config =
                    typeConfig[notification.type] || typeConfig.new_message;
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer ${
                        notification.isRead
                          ? "hover:bg-secondary/40"
                          : "bg-primary/5 border-l-2 border-primary hover:bg-primary/10"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          notification.isRead
                            ? "bg-secondary/60"
                            : "bg-primary/10"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm truncate ${
                            notification.isRead
                              ? "text-foreground"
                              : "font-semibold text-foreground"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                            },
                          )}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                      )}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link
                  to="/notifications"
                  className="w-full text-center text-sm text-primary font-medium py-1"
                >
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.fullname.split(" ").map((n) => n[0]) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.fullname}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center ">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog */}
          <SendTestDialog
            open={isTestDialogOpen}
            onOpenChange={setIsTestDialogOpen}
          />
        </div>
      </div>
    </header>
  );
}
