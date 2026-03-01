import { NavLink } from "react-router-dom";
import { Home, Calendar, Users, QrCode } from "lucide-react";

export default function Sidebar() {
  const base =
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all";
  const active = "bg-primary text-white";
  const hover = "hover:bg-slate-200 dark:hover:bg-slate-800";

  return (
    <div className="hidden md:flex flex-col w-64 min-h-screen bg-white/60 dark:bg-black/40 backdrop-blur-lg p-6 gap-6 border-r">
      <div className="text-lg font-bold text-primary">
        Dashboard
      </div>

      <nav className="flex flex-col gap-3 text-slate-700 dark:text-slate-200">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${base} ${hover} ${isActive ? active : ""}`
          }
        >
          <Home size={18} /> Home
        </NavLink>

        <NavLink
          to="/create-event"
          className={({ isActive }) =>
            `${base} ${hover} ${isActive ? active : ""}`
          }
        >
          <Calendar size={18} /> Events
        </NavLink>

        <NavLink
          to="/my-events"
          className={({ isActive }) =>
            `${base} ${hover} ${isActive ? active : ""}`
          }
        >
          <Users size={18} /> Users
        </NavLink>

        <NavLink
          to="/scan"
          className={({ isActive }) =>
            `${base} ${hover} ${isActive ? active : ""}`
          }
        >
          <QrCode size={18} /> Scan
        </NavLink>

      </nav>
    </div>
  );
}