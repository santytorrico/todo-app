import axios from "axios";

// const API_URL = "https://todo-app-production-e398.up.railway.app/api/auth";
const API_URL = "http://localhost:3000/api/auth";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/signup`, { name, email, password });
  return response.data;
};

export const forgotpassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/forgot-password`, {email});
  return response.data;
}