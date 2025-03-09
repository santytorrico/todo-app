import { create } from "zustand";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { useAuthStore } from "./authStore";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type TaskState = {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (id: number, completed: boolean) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
};

export const useTaskStore = create<TaskState>((set) => {
  const token = useAuthStore.getState().token;

  return {
    tasks: [],
    fetchTasks: async () => {
      if (!token) return;
      const tasks = await getTasks(token);
      set({ tasks });
    },
    addTask: async (title) => {
      if (!token) return;
      const newTask = await createTask(token, title);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    },
    toggleTask: async (id, completed) => {
      if (!token) return;
      await updateTask(token, id, completed);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? { ...task, completed } : task)),
      }));
    },
    removeTask: async (id) => {
      if (!token) return;
      await deleteTask(token, id);
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
    },
  };
});