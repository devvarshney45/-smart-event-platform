import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">

      {/* Navbar */}
      <div className="h-16 shrink-0 w-full">
        <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
      </div>

      <div className="flex flex-1 w-full overflow-hidden relative">

        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:static z-50
            top-16 md:top-0
            h-[calc(100vh-4rem)] md:h-auto
            w-64
            bg-white dark:bg-slate-800
            border-r border-slate-200 dark:border-slate-700
            transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <Sidebar closeSidebar={() => setIsOpen(false)} />
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}