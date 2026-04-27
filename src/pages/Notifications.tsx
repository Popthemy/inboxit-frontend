import { useEffect, useMemo, useState, type ElementType } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FilterDropdown } from "@/components/dashboard/FilterDropdown";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { useNotifications } from "@/contexts/useNotifications";
import {
  type NotificationType,
  type Notification,
  typeConfig,
  routeMap,
  filterOptions,
} from "@/utils/notificationUtils";

function groupByTime(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const todayItems: Notification[] = [];
  const yesterdayItems: Notification[] = [];
  const earlierItems: Notification[] = [];

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);
    if (isToday(date)) todayItems.push(notification);
    else if (isYesterday(date)) yesterdayItems.push(notification);
    else earlierItems.push(notification);
  });

  if (todayItems.length) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length)
    groups.push({ label: "Yesterday", items: yesterdayItems });
  if (earlierItems.length)
    groups.push({ label: "Earlier", items: earlierItems });

  return groups;
}

const INITIAL_COUNT = 10;

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    loadNotifications,
    markAsRead,
  } = useNotifications();
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [typeFilter, setTypeFilter] = useState("all_types");
  const [showCount, setShowCount] = useState(INITIAL_COUNT);
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(
    [],
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const filtered = useMemo(() => {
    let list = localNotifications;
    if (tab === "unread") list = list.filter((item) => !item.isRead);
    if (typeFilter !== "all_types") {
      list = list.filter((item) => item.type === typeFilter);
    }
    return list;
  }, [localNotifications, tab, typeFilter]);

  const visible = filtered.slice(0, showCount);
  const groups = groupByTime(visible);

  const handleClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    setLocalNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, isRead: true } : item,
      ),
    );
    const pathFn = routeMap[notification.type];
    if (pathFn) {
      navigate(pathFn(notification.objectId));
    }
  };

  const markAllRead = async () => {
    await Promise.all(
      localNotifications
        .filter((item) => !item.isRead)
        .map((item) => markAsRead(item.id)),
    );
    setLocalNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true })),
    );
  };

  const clearRead = () => {
    setLocalNotifications((prev) => prev.filter((item) => !item.isRead));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {loading
              ? "Loading notifications..."
              : error
                ? error
                : unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={unreadCount === 0 || loading}
            className="gap-1.5"
          >
            <Check className="h-3.5 w-3.5" /> Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearRead}
            className="gap-1.5 text-muted-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear read
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-secondary/50 rounded-lg p-0.5">
          {(["all", "unread"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "all" ? "All" : "Unread"}
              {t === "unread" && unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1.5 h-5 px-1.5 text-[10px]"
                >
                  {unreadCount}
                </Badge>
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

      {groups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            No notifications
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You're all caught up. Check back later.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {groups.map((group) => (
              <div key={group.label} className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.items.map((notification, index) => {
                    const config =
                      typeConfig[notification.type] || typeConfig.new_message;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleClick(notification)}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors group ${
                          notification.isRead
                            ? "hover:bg-secondary/40"
                            : "bg-primary/5 border-l-2 border-primary hover:bg-primary/10"
                        }`}
                      >
                        <div
                          className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            notification.isRead
                              ? "bg-secondary/60"
                              : "bg-primary/10"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm truncate ${
                                notification.isRead
                                  ? "text-foreground"
                                  : "font-semibold text-foreground"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true },
                            )}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCount((count) => count + 10)}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
