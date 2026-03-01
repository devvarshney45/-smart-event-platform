import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">

      {/* Top Navbar */}
      <Navbar />

      {/* Main Body */}
      <div className="flex pt-16">

        {/* Sidebar */}
        <div className="w-64 h-[calc(100vh-64px)] fixed left-0 top-16 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 ml-64 p-8">
          {children}
        </div>

      </div>
    </div>
  );
}