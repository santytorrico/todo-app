import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

export const getTasks = async (token: string) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createTask = async (token: string, title: string, description: string ) => {
  const response = await axios.post(
    API_URL,
    { title, description },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const updateTask = async (token: string, id: number, completed: boolean) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { completed },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteTask = async (token: string, id: number) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};