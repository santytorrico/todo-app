import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "todo-app-production-e398.up.railway.app"}/api/auth`;

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/signup`, { name, email, password });
  return response.data;
};