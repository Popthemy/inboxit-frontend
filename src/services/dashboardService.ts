import apiClient from "./client";

export interface DashboardMetrics {
  totals: {
    messages: number;
    messagesToday: number;
    activeApiKeys: number;
    activeRoutes: number;
  };
  rates: {
    success: number;
    failed: number;
  };
  recentActivity: {
    id: number;
    subject: string;
    status: string;
    sentAt: string;
  }[];
  messagesPerDay: {
    day: string;
    count: number;
  }[];
  messagesPerRoute: {
    routeId: number;
    routeLabel: string;
    routeIsActive: boolean;
    routeCreatedAt: string;
    count: number;
  }[];
}

export const fetchDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const res = await apiClient.get("/dashboard/metrics/");
  return res.data;
};
