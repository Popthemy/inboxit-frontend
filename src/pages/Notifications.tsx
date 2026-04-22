import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  AlertTriangle,
  Key,
  KeyRound,
  Route,
  AlertCircle,
  CreditCard,
  Plug,
  Shield,
  Bell,
  Check,
  Trash2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { formatDistanceToNow, subMinutes, subHours, subDays, isToday, isYesterday } from "date-fns";

type NotificationType =
  | "new_message"
  | "message_failed"
  | "api_key_created"
  | "api_key_revoked"
  | "route_activated"
  | "route_deactivated"
  | "usage_limit_warning"
  | "payment_success"
  | "integration_connected"
  | "spam_blocked";

interface Notification {
  id: number;
  type: NotificationType;
  target_type: string;
  target_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

const typeConfig: Record<NotificationType, { label: string; icon: React.ElementType; color: string }> = {
  new_message: { label: "New Message", icon: MessageSquare, color: "text-blue-400" },
  message_failed: { label: "Failed", icon: AlertTriangle, color: "text-destructive" },
  api_key_created: { label: "API Key", icon: Key, color: "text-green-400" },
  api_key_revoked: { label: "Revoked", icon: KeyRound, color: "text-orange-400" },
  route_activated: { label: "Route", icon: Route, color: "text-green-400" },
  route_deactivated: { label: "Route", icon: Route, color: "text-muted-foreground" },
  usage_limit_warning: { label: "Warning", icon: AlertCircle, color: "text-yellow-400" },
  payment_success: { label: "Payment", icon: CreditCard, color: "text-green-400" },
  integration_connected: { label: "Integration", icon: Plug, color: "text-purple-400" },
  spam_blocked: { label: "Spam", icon: Shield, color: "text-red-400" },
};

const routeMap: Record<string, (id: string) => string> = {
  MESSAGE: (id) => `/messages/${id}`,
  API_KEY: () => "/api-keys",
  ROUTE: () => "/routes",
  PAYMENT: () => "/settings",
  INTEGRATION: () => "/settings",
  SPAM: () => "/messages",
};

const now = new Date();

const mockNotifications: Notification[] = [
  { id: 1, type: "new_message", target_type: "MESSAGE", target_id: "msg_301", title: "New message from contact form", message: "John Doe submitted your portfolio contact form.", is_read: false, created_at: subMinutes(now, 5) },
  { id: 2, type: "spam_blocked", target_type: "SPAM", target_id: "", title: "Spam attempt blocked", message: "Honeypot triggered on route /api/contact. Request rejected.", is_read: false, created_at: subMinutes(now, 22) },
  { id: 3, type: "api_key_created", target_type: "API_KEY", target_id: "", title: "New API key created", message: "API key pk_live_9x...3f was generated.", is_read: false, created_at: subHours(now, 1) },
  { id: 4, type: "new_message", target_type: "MESSAGE", target_id: "msg_299", title: "New message received", message: "Sarah Connor filled out the waitlist form on your landing page.", is_read: false, created_at: subHours(now, 3) },
  { id: 5, type: "usage_limit_warning", target_type: "PAYMENT", target_id: "", title: "Approaching usage limit", message: "You've used 90% of your monthly message quota (900/1000).", is_read: true, created_at: subHours(now, 5) },
  { id: 6, type: "route_activated", target_type: "ROUTE", target_id: "", title: "Route activated", message: "Route /api/feedback is now live and accepting submissions.", is_read: true, created_at: subHours(now, 8) },
  { id: 7, type: "message_failed", target_type: "MESSAGE", target_id: "msg_295", title: "Message delivery failed", message: "Email to admin@example.com bounced. Check your route config.", is_read: false, created_at: subDays(now, 1).setHours(14, 30) ? subDays(now, 1) : subDays(now, 1) },
  { id: 8, type: "payment_success", target_type: "PAYMENT", target_id: "", title: "Payment successful", message: "Your Pro plan payment of $19/mo was processed successfully.", is_read: true, created_at: subDays(now, 1) },
  { id: 9, type: "integration_connected", target_type: "INTEGRATION", target_id: "", title: "Slack integration connected", message: "Notifications will now be forwarded to #inboxit-alerts.", is_read: true, created_at: subDays(now, 1) },
  { id: 10, type: "api_key_revoked", target_type: "API_KEY", target_id: "", title: "API key revoked", message: "API key pk_test_2a...7b has been revoked for security.", is_read: true, created_at: subDays(now, 2) },
  { id: 11, type: "new_message", target_type: "MESSAGE", target_id: "msg_280", title: "New message received", message: "Mike Chen submitted feedback via your SaaS onboarding form.", is_read: true, created_at: subDays(now, 3) },
  { id: 12, type: "route_deactivated", target_type: "ROUTE", target_id: "", title: "Route deactivated", message: "Route /api/old-contact was deactivated due to inactivity.", is_read: true, created_at: subDays(now, 4) },
  { id: 13, type: "spam_blocked", target_type: "SPAM", target_id: "", title: "Multiple spam attempts blocked", message: "12 spam submissions blocked on /api/contact in the last 24h.", is_read: true, created_at: subDays(now, 5) },
  { id: 14, type: "new_message", target_type: "MESSAGE", target_id: "msg_270", title: "New message received", message: "Emily Rose submitted your event registration form.", is_read: true, created_at: subDays(now, 6) },
  { id: 15, type: "usage_limit_warning", target_type: "PAYMENT", target_id: "", title: "Usage limit reached", message: "You've hit your monthly limit. Upgrade to continue sending.", is_read: true, created_at: subDays(now, 7) },
];

const filterOptions = [
  { value: "all_types", label: "All Types" },
  { value: "new_message", label: "Messages" },
  { value: "message_failed", label: "Failed" },
  { value: "api_key_created", label: "API Keys" },
  { value: "route_activated", label: "Routes" },
  { value: "usage_limit_warning", label: "Warnings" },
  { value: "payment_success", label: "Payments" },
  { value: "integration_connected", label: "Integrations" },
  { value: "spam_blocked", label: "Spam" },
];

function groupByTime(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const todayItems: Notification[] = [];
  const yesterdayItems: Notification[] = [];
  const earlierItems: Notification[] = [];

  notifications.forEach((n) => {
    const d = new Date(n.created_at);
    if (isToday(d)) todayItems.push(n);
    else if (isYesterday(d)) yesterdayItems.push(n);
    else earlierItems.push(n);
  });

  if (todayItems.length) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (earlierItems.length) groups.push({ label: "Earlier", items: earlierItems });

  return groups;
}

const INITIAL_COUNT = 10;

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState("all_types");
  const [showCount, setShowCount] = useState(INITIAL_COUNT);

  const filtered = useMemo(() => {
    let list = notifications;
    if (tab === "unread") list = list.filter((n) => !n.is_read);
    if (typeFilter !== "all_types") list = list.filter((n) => n.type === typeFilter || (typeFilter === "api_key_created" && (n.type === "api_key_created" || n.type === "api_key_revoked")) || (typeFilter === "route_activated" && (n.type === "route_activated" || n.type === "route_deactivated")));
    return list;
  }, [notifications, tab, typeFilter]);

  const visible = filtered.slice(0, showCount);
  const groups = groupByTime(visible);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleClick = (notification: Notification) => {
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n)));
    const pathFn = routeMap[notification.target_type];
    if (pathFn) navigate(pathFn(notification.target_id));
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  const clearRead = () => setNotifications((prev) => prev.filter((n) => !n.is_read));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} disabled={unreadCount === 0} className="gap-1.5">
            <Check className="h-3.5 w-3.5" /> Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearRead} className="gap-1.5 text-muted-foreground">
            <Trash2 className="h-3.5 w-3.5" /> Clear read
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-secondary/50 rounded-lg p-0.5">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "all" ? "All" : "Unread"}
              {t === "unread" && unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1.5 h-5 px-1.5 text-[10px]">{unreadCount}</Badge>
              )}
            </button>
          ))}
        </div>
        <FilterDropdown
          placeholder="All Types"
          value={typeFilter}
          onValueChange={setTypeFilter}
          options={filterOptions}
          className="w-[160px]"
        />
      </div>

      {/* Notification Groups */}
      {groups.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No notifications</h3>
          <p className="text-sm text-muted-foreground mt-1">You're all caught up. Check back later.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {groups.map((group) => (
              <div key={group.label} className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">{group.label}</h3>
                <div className="space-y-1">
                  {group.items.map((n, i) => {
                    const config = typeConfig[n.type];
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleClick(n)}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${
                          n.is_read
                            ? "hover:bg-secondary/40"
                            : "bg-primary/5 border-l-2 border-primary hover:bg-primary/10"
                        }`}
                      >
                        <div className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.is_read ? "bg-secondary/60" : "bg-primary/10"}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm truncate ${n.is_read ? "text-foreground" : "font-semibold text-foreground"}`}>
                              {n.title}
                            </p>
                            {!n.is_read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                          <p className="text-[11px] text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </AnimatePresence>

          {filtered.length > showCount && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowCount((c) => c + 10)}>
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
