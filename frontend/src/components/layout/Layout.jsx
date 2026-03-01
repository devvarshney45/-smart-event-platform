import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-100 dark:bg-slate-900">

      {/* ================= NAVBAR ================= */}
      <header className="h-16 w-full shrink-0 border-b border-slate-200 dark:border-slate-700">
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
      </header>

      {/* ================= MAIN BODY ================= */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ===== MOBILE OVERLAY ===== */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* ===== SIDEBAR ===== */}
        <aside
          className={`
            fixed md:static
            top-16 md:top-0
            left-0
            h-[calc(100vh-4rem)] md:h-auto
            w-64
            bg-white dark:bg-slate-800
            border-r border-slate-200 dark:border-slate-700
            overflow-y-auto
            z-50
            transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <Sidebar closeSidebar={() => setIsOpen(false)} />
        </aside>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}