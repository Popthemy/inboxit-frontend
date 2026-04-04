import axios from "axios";
import { camelizeKeys, decamelizeKeys } from "humps";


// Base API URL — update this to your Django backend URL
export const API_BASE_URL = "http://127.0.0.1:8000/api/v1";


// Setup Axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically transform data for all requests/responses
api.interceptors.response.use((response) => {
  if (
    response.data &&
    response.headers["content-type"]?.includes("application/json")
  ) {
    response.data = camelizeKeys(response.data);
  }
  return response;
});

api.interceptors.request.use((config) => {
  if (config.data) config.data = decamelizeKeys(config.data);
  if (config.params) config.params = decamelizeKeys(config.params);
  return config;
});

export default api;
