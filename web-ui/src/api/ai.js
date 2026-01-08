import axios from "axios";

const API_URL = "https://todoapp-api-x6bx.onrender.com/api/ai";
// const API_URL = "http://localhost:3000/api/ai";

export const getTasksSummary = async (token, tasks) => {
  const response = await axios.post(
    `${API_URL}/combined-summary`,
    { tasks },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.summary;
};