import { useState, useEffect } from "react";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { useAppStore } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const theme = useAppStore((state) => state.theme);
  const logout = useAppStore((state) => state.logout);

  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Proper scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-black/50 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold text-primary cursor-pointer"
      >
        SmartEvent
      </h1>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-primary transition"
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 right-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 md:hidden"
        >
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 text-sm hover:text-primary transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}