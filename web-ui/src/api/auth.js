import axios from "axios";

const API_URL = "https://todoapp-api-x6bx.onrender.com/api/auth";
// const API_URL = "http://localhost:3000/api/auth";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const signup = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/signup`, { name, email, password });
  return response.data;
};

export const forgotpassword = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, {email});
  return response.data;
}