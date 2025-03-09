import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/signup`, { name, email, password });
  return response.data;
};