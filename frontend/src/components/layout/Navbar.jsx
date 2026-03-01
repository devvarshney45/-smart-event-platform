import { useState } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { useAppStore } from "../../app/store";
import { useAppStore } from "../../app/store";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const theme = useAppStore((state) => state.theme);
  const [scrolled, setScrolled] = useState(false);

  window.addEventListener("scroll", () => {
    setScrolled(window.scrollY > 20);
  });

  return (
    <nav
      className={`fixed w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-black/40 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      }`}
    >
      <h1 className="text-xl font-bold text-primary">SmartEvent</h1>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <Menu size={22} className="md:hidden" />
      </div>
    </nav>
  );
}