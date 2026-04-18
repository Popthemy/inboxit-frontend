import apiClient from "./client";

export const apikeyService = {
  // list: async (params?: string) => {
  //   const res = await apiClient.get(`/route-apikeys/${params ?? ""}`);
  //   return res.data;
  // },

  // retrieve: async (id: string) => {
  //   const res = await apiClient.get(`/route-apikeys/${id}/`);
  //   return res.data;
  // },

  // create: async (payload: any) => {
  //   const res = await apiClient.post("/route-apikeys/", payload);
  //   return res.data;
  // },

  // update: async (id: string, payload: any) => {
  //   const res = await apiClient.patch(`/route-apikeys/${id}/`, payload);
  //   return res.data;
  // },

  regenerate: async (id: string) => {
    const res = await apiClient.post(`/apikeys/${id}/regenerate/`);
    return res.data;
  },
};
