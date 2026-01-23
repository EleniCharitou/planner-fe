import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import backendUrl from "./config";

const api: AxiosInstance = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        globalThis.location.href = "/login";
      }

      if (error.response.status === 403) {
        console.error("Access denied");
      }

      if (error.response.status === 404) {
        console.error("Resource not found");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
