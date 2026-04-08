import apiClient from "./client";


export const integrationService = {
  list: async (params?: string) => {
    const res = await apiClient.get(`${params ?? ""}`);
    return res.data;
  },

  retrieve: async (id: string) => {
    const res = await apiClient.get(`${id}/`);
    return res.data;
  },

  create: async (payload: any) => {
    const res = await apiClient.post("/", payload);
    return res.data;
  },

  update: async (id: string, payload: any) => {
    const res = await apiClient.patch(`${id}/`, payload);
    return res.data;
  },

  remove: async (id: string) => {
    await apiClient.delete(`${id}/`);
  },
};