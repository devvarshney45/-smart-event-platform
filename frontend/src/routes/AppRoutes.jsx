import { Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "../app/store";
import { Outlet } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateEvent from "../pages/CreateEvent";
import MyEvents from "../pages/MyEvents";
import Scan from "../pages/Scan";
import Certificate from "../pages/Certificate";
import AdminUsers from "../pages/AdminUsers";

import Layout from "../components/layout/Layout";

/* PROTECTED WRAPPER */
function ProtectedRoute({ allowedRoles }) {
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

/* PUBLIC WRAPPER */
function PublicRoute({ children }) {
  const token = useAppStore((state) => state.token);
  return token ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* PROTECTED ROOT */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin-users" element={<AdminUsers />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
            <Route path="/dashboard/create-event" element={<CreateEvent />} />
            <Route path="/dashboard/my-events" element={<MyEvents />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["volunteer"]} />}>
            <Route path="/dashboard/scan" element={<Scan />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["participant","admin"]} />}>
            <Route path="/dashboard/certificate/:id" element={<Certificate />} />
          </Route>

        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}