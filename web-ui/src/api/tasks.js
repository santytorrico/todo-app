import axios from "axios";

const API_URL = "https://todoapp-api-x6bx.onrender.com/api/tasks";
// const API_URL = "http://localhost:3000/api/tasks";
export const getTasks = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTask = async (token, title, description ) => {
  const response = await axios.post(
    API_URL,
    { title, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateTask = async (
  token,
  id,
  title,
  description,
  completed,
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { 
      title, description, is_completed: completed 
    },
    { 
      headers: { Authorization: `Bearer ${token}` } 
    },
  );
  return response.data;
};

export const deleteTask = async (token, id) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};