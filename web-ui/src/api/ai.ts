import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL || "todo-app-production-e398.up.railway.app"}/api/auth`;

export const getTasksSummary = async (token: string, tasks: any[]) => {
  const response = await axios.post(
    `${API_URL}/combined-summary`,
    { tasks },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.summary;
};