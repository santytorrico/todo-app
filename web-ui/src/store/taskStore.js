// store/taskStore.ts
import { create } from "zustand";
import { getTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { getTasksSummary } from "../api/ai";
import { useAuthStore } from "./authStore";

export const useTaskStore = create((set, get) => {
  return {
    tasks: [],
    summary: "",
    isSummarizing: false,

    fetchTasks: async () => {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const tasks = await getTasks(token);
      set({ tasks });
    },

    addTask: async (title, description) => {
      const token = useAuthStore.getState().token;
      if (!token) return;
      const newTask = await createTask(token, title, description);
      set((state) => ({ tasks: [...state.tasks, newTask] }));
    },

    updateTask: async (id, title, description, completed) => {
      const token = useAuthStore.getState().token;
      if (!token) return;
      await updateTask(token, id, title, description, completed);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, title, description, completed } : task
        ),
      }));
    },

    removeTask: async (id) => {
      const token = useAuthStore.getState().token;
      if (!token) return;
      await deleteTask(token, id);
      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
    },

    generateSummary: async (selectedTaskIds) => {
      const token = useAuthStore.getState().token;
      if (!token) return;
      set({ isSummarizing: true });
      try {
        const { tasks } = get();
        const tasksToSummarize = selectedTaskIds 
          ? tasks.filter(task => selectedTaskIds.includes(task.id)) 
          : tasks;
          
        if (tasksToSummarize.length === 0) {
          set({ summary: "No tasks selected for summary", isSummarizing: false });
          return;
        }
        
        const summary = await getTasksSummary(token, tasksToSummarize);
        set({ summary, isSummarizing: false });
      } catch (error) {
        console.error("Error generating summary:", error);
        set({ summary: "Failed to generate summary", isSummarizing: false });
      }
    },
    clearTasks: () => {
      set({ tasks: [] , summary: "" });
    }
  };
});