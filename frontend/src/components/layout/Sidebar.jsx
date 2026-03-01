import { NavLink } from "react-router-dom";
import { Home, Calendar, Users, QrCode } from "lucide-react";
import { useAppStore } from "../../app/store";

export default function Sidebar() {
  const user = useAppStore((state) => state.user);
  const role = user?.role || "";

  const menu = [
    {
      label: "Home",
      icon: Home,
      path: "/dashboard",
      roles: ["admin", "organizer", "volunteer", "participant"],
      exact: true,
    },
    {
      label: "Users",
      icon: Users,
      path: "/dashboard/admin-users",
      roles: ["admin"],
    },
    {
      label: "Create Event",
      icon: Calendar,
      path: "/dashboard/create-event",
      roles: ["organizer"],
    },
    {
      label: "My Events",
      icon: Calendar,
      path: "/dashboard/my-events",
      roles: ["organizer"],
    },
    {
      label: "Scan",
      icon: QrCode,
      path: "/dashboard/scan",
      roles: ["volunteer"],
    },
  ];

  const panelTitle =
    role === "admin"
      ? "Admin Panel"
      : role === "organizer"
      ? "Organizer Panel"
      : role === "volunteer"
      ? "Volunteer Panel"
      : "Dashboard";

  return (
    <div className="flex flex-col h-full pt-6 px-6 pb-6">

      {/* Panel Title */}
      <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-8">
        {panelTitle}
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        {menu
          .filter((item) => item.roles.includes(role))
          .map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`
                }
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
      </nav>

    </div>
  );
}