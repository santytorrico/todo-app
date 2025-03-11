import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "todo-app-production-e398.up.railway.app"}/api/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;