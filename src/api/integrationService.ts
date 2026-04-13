import apiClient from "./client";

export const integrationService = {
  list: async (params?: string) => {
    const res = await apiClient.get(`/route-apikeys/${params ?? ""}`);
    return res.data;
  },

  retrieve: async (id: string) => {
    const res = await apiClient.get(`/route-apikeys/${id}/`);
    return res.data;
  },

  create: async (payload: any) => {
    const res = await apiClient.post("/route-apikeys/", payload);
    return res.data;
  },

  update: async (id: string, payload: any) => {
    const res = await apiClient.patch(`/route-apikeys/${id}/`, payload);
    return res.data;
  },

  remove: async (id: string) => {
    await apiClient.delete(`/route-apikeys/${id}/`);
  },
};
