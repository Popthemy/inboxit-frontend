import React, { createContext, useCallback, useState } from "react";
import notificationService, {
  NotificationItem,
  NotificationListResponse,
} from "../services/notificationService";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncNotifications = (data: NotificationListResponse) => {
    setNotifications(data.results);
    setUnreadCount(
      data.unreadCount ?? data.results.filter((item) => !item.isRead).length,
    );
  };

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await notificationService.list();
      syncNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) => {
        let wasUnread = false;
        const updated = prev.map((notification) => {
          if (notification.id === id) {
            if (!notification.isRead) {
              wasUnread = true;
            }
            return { ...notification, isRead: true };
          }
          return notification;
        });

        if (wasUnread) {
          setUnreadCount((count) => Math.max(count - 1, 0));
        }

        return updated;
      });
    } catch (err) {
      console.error(`Failed to mark notification ${id} read:`, err);
    }
  }, []);

  const markAsUnread = useCallback(async (id: number) => {
    try {
      await notificationService.markUnread(id);
      setNotifications((prev) => {
        let wasRead = false;
        const updated = prev.map((notification) => {
          if (notification.id === id) {
            if (notification.isRead) {
              wasRead = true;
            }
            return { ...notification, isRead: false };
          }
          return notification;
        });

        if (wasRead) {
          setUnreadCount((count) => count + 1);
        }

        return updated;
      });
    } catch (err) {
      console.error(`Failed to mark notification ${id} unread:`, err);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        loadNotifications,
        markAsRead,
        markAsUnread,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
