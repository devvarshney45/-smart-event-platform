import { create } from "zustand";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

export const useAppStore = create((set) => ({
  user: storedUser && storedUser !== "undefined"
    ? JSON.parse(storedUser)
    : null,

  token: storedToken || null,

  theme: localStorage.getItem("theme") || "light",

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));