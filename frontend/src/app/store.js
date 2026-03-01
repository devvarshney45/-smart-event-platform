import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  theme: "light",

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
}));