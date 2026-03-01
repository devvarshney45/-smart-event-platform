import { Moon, Sun, LogOut, Menu } from "lucide-react";
import { useAppStore } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar({ toggleSidebar }) {
  const { toggleTheme, theme, logout } = useAppStore();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div className="h-full w-full flex items-center justify-between px-4 md:px-6">

        {/* ===== LEFT SECTION ===== */}
        <div className="flex items-center gap-3">

          {/* Mobile Hamburger */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <div
            onClick={() => navigate("/dashboard")}
            className="text-lg md:text-xl font-bold cursor-pointer text-indigo-600"
          >
            SmartEvent
          </div>

        </div>

        {/* ===== RIGHT SECTION ===== */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>

      </div>
    </motion.nav>
  );
}