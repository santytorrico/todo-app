import { create } from "zustand";

type AuthState = {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

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

    window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }));
  },
}));

window.addEventListener("storage", (event) => {
  if (event.key === "token") {
    useAuthStore.setState({ token: event.newValue });
  }
});