import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 dark:bg-slate-900">

      {/* ================= NAVBAR ================= */}
      <header className="h-16 w-full shrink-0 border-b border-slate-200 dark:border-slate-700">
        <Navbar />
      </header>

      {/* ================= MAIN BODY ================= */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===== SIDEBAR ===== */}
        <aside className="w-64 shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
          <Sidebar />
        </aside>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}