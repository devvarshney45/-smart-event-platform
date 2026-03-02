import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900">

      {/* NAVBAR */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-700">
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static
            top-16 md:top-0
            left-0
            w-64
            h-[calc(100vh-4rem)] md:h-auto
            bg-white dark:bg-slate-800
            border-r border-slate-200 dark:border-slate-700
            transform transition-transform duration-300 z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <Sidebar closeSidebar={() => setIsOpen(false)} />
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}