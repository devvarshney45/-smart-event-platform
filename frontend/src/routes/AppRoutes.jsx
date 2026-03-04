import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../app/store";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateEvent from "../pages/CreateEvent";
import MyEvents from "../pages/MyEvents";
import EditEvent from "../pages/EditEvent";
import Scan from "../pages/Scan";
import AdminUsers from "../pages/AdminUsers";
import MyRegistrations from "../pages/MyRegistrations";
import VerifyCertificate from "../pages/VerifyCertificate";

import Layout from "../components/layout/Layout";

/* ================= PROTECTED WRAPPER ================= */

function ProtectedRoute({ allowedRoles }) {

  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

/* ================= PUBLIC WRAPPER ================= */

function PublicRoute({ children }) {

  const token = useAppStore((state) => state.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {

  return (

    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* CERTIFICATE VERIFY */}

      <Route path="/verify/:certId" element={<VerifyCertificate />} />

      {/* ================= PROTECTED ================= */}

      <Route element={<ProtectedRoute />}>

        <Route element={<Layout />}>

          {/* DASHBOARD */}

          <Route path="/dashboard" element={<Dashboard />} />

          {/* ADMIN */}

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin-users" element={<AdminUsers />} />
          </Route>

          {/* ORGANIZER */}

          <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
            <Route path="/dashboard/create-event" element={<CreateEvent />} />
            <Route path="/dashboard/my-events" element={<MyEvents />} />
            <Route path="/dashboard/edit-event/:id" element={<EditEvent />} />
          </Route>

          {/* VOLUNTEER */}

          <Route element={<ProtectedRoute allowedRoles={["volunteer"]} />}>
            <Route path="/dashboard/scan" element={<Scan />} />
          </Route>

          {/* PARTICIPANT */}

          <Route element={<ProtectedRoute allowedRoles={["participant"]} />}>
            <Route path="/dashboard/my-registrations" element={<MyRegistrations />} />
          </Route>

        </Route>

      </Route>

      {/* ================= FALLBACK ================= */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

  );
}