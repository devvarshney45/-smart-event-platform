import { NavLink } from "react-router-dom";
import { Home, Calendar, Users, QrCode } from "lucide-react";
import { useAppStore } from "../../app/store";

export default function Sidebar() {
  const user = useAppStore((state) => state.user);

  const role = user?.role;

  const menu = [
    {
      label: "Home",
      icon: <Home size={18} />,
      path: "/dashboard",
      roles: ["admin", "organizer", "volunteer", "participant"],
    },
    {
      label: "Events",
      icon: <Calendar size={18} />,
      path: "/create-event",
      roles: ["admin", "organizer"],
    },
    {
      label: "My Events",
      icon: <Users size={18} />,
      path: "/my-events",
      roles: ["admin", "organizer"],
    },
    {
      label: "Scan",
      icon: <QrCode size={18} />,
      path: "/scan",
      roles: ["admin", "volunteer"],
    },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 shadow p-6">
      <div className="text-lg font-bold text-primary mb-6">Dashboard</div>

      <nav className="flex flex-col gap-4">
        {menu
          .filter((item) => item.roles.includes(role))
          .map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-slate-700"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
      </nav>
    </div>
  );
}