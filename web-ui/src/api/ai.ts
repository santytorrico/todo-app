import axios from "axios";

// const API_URL = "https://todo-app-production-e398.up.railway.app/api/ai";
const API_URL = "http://localhost:3000/api/ai";

export const getTasksSummary = async (token: string, tasks: any[]) => {
  const response = await axios.post(
    `${API_URL}/combined-summary`,
    { tasks },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.summary;
};