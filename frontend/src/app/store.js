import { create } from "zustand";

export const useAppStore = create((set) => ({
  user: null,
  token: null,
  theme: "light",

  /* ================= INIT (HYDRATE SAFE) ================= */
  initialize: () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedTheme = localStorage.getItem("theme");

    set({
      user:
        storedUser && storedUser !== "undefined"
          ? JSON.parse(storedUser)
          : null,
      token: storedToken || null,
      theme: storedTheme || "light",
    });
  },

  /* ================= USER ================= */
  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    set({ user });
  },

  /* ================= TOKEN ================= */
  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },

  /* ================= LOGOUT ================= */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: null });
  },

  /* ================= THEME ================= */
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      return { theme: newTheme };
    }),
}));
