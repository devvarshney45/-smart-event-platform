import { Home, Calendar, Users, QrCode } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 min-h-screen bg-white/60 dark:bg-black/40 backdrop-blur-lg p-6 gap-6">
      <div className="text-lg font-bold text-primary">Dashboard</div>

      <nav className="flex flex-col gap-4 text-slate-700 dark:text-slate-200">
        <a className="flex items-center gap-3 hover:text-primary">
          <Home size={18} /> Home
        </a>
        <a className="flex items-center gap-3 hover:text-primary">
          <Calendar size={18} /> Events
        </a>
        <a className="flex items-center gap-3 hover:text-primary">
          <Users size={18} /> Users
        </a>
        <a className="flex items-center gap-3 hover:text-primary">
          <QrCode size={18} /> Scan
        </a>
      </nav>
    </div>
  );
}