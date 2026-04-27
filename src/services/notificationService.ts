import apiClient from "./client";

export interface NotificationItem {
  id: number;
  user: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  title: string;
  message: string;
  objectId: string | null;
}

export interface NotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  unreadCount: number;
  results: NotificationItem[];
}

const notificationService = {
  list: async (page = 1, pageSize = 20): Promise<NotificationListResponse> => {
    const res = await apiClient.get("/notifications/", {
      params: {
        page,
        page_size: pageSize,
      },
    });
    // API returns nested structure: { count, next, previous, results: { results: [...], unread_count: number } }
    return {
      count: res.data.count,
      next: res.data.next,
      previous: res.data.previous,
      unreadCount: res.data.results.unread_count,
      results: res.data.results.results,
    };
  },

  getById: async (id: number): Promise<NotificationItem> => {
    const res = await apiClient.get(`/notifications/${id}/`);
    return res.data;
  },

  markRead: async (id: number): Promise<NotificationItem> => {
    const res = await apiClient.post(`/notifications/${id}/read/`);
    return res.data;
  },

  markUnread: async (id: number): Promise<NotificationItem> => {
    const res = await apiClient.post(`/notifications/${id}/unread/`);
    return res.data;
  },
};

export default notificationService;
