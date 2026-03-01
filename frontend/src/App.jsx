import { BrowserRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useAppStore } from "./app/store";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const theme = useAppStore((state) => state.theme);

  // Apply dark mode class to html
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </BrowserRouter>
  );
}