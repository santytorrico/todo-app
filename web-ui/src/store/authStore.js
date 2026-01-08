import { create } from "zustand";
import { useTaskStore } from "./taskStore";

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
    
    window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: token }));
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
    setTimeout(() => {
      if (useTaskStore.getState().clearTasks) {
        useTaskStore.getState().clearTasks();
      }
    }, 0);
    window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }));
  },
}));

window.addEventListener("storage", (event) => {
  if (event.key === "token") {
    useAuthStore.setState({ token: event.newValue });
    setTimeout(() => {
      if (useTaskStore.getState().clearTasks) {
        useTaskStore.getState().clearTasks();
      }
    }, 0);
  }
});