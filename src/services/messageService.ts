import apiClient from "./client";

export const fetchMessages = async (page = 1, pageSize = 10) => {
  const res = await apiClient.get(
    `/messages/?page=${page}&page_size=${pageSize}`,
  );
  return res.data;
};

export const fetchMessageById = async (id: number) => {
  const res = await apiClient.get(`/messages/${id}/`);
  return res.data;
};
