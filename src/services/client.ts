import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";
import { getCookie } from "@/contexts/AuthContext";

// Base API URL — update this to your Django backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v2";

// Setup Axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically transform data for all requests/responses
apiClient.interceptors.response.use((response) => {
  if (
    response.data &&
    response.headers["content-type"]?.includes("application/json")
  ) {
    response.data = camelizeKeys(response.data);
  }
  return response;
});

apiClient.interceptors.request.use((config) => {
  if (config.data) config.data = decamelizeKeys(config.data);
  if (config.params) config.params = decamelizeKeys(config.params);

  const token = getCookie("inboxit_access");
  // Skip auth for login/refresh endpoints
  const isAuthRoute =
    config.url?.includes("/users/login/") ||
    config.url?.includes("/users/refresh/");
  if (token && !isAuthRoute) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
