import { Moon, Sun, LogOut } from "lucide-react";
import { useAppStore } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const { toggleTheme, theme, logout } = useAppStore();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -40 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-screen h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div className="h-full w-full flex items-center justify-between px-6">

        <div
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold cursor-pointer text-indigo-600"
        >
          SmartEvent
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </div>
    </motion.nav>
  );
}