import { Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "../app/store";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateEvent from "../pages/CreateEvent";
import MyEvents from "../pages/MyEvents";
import VolunteerScan from "../pages/VolunteerScan";

/* =========================
   Protected Route Wrapper
========================= */

function ProtectedRoute({ children, allowedRoles }) {
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles restriction exists
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* =========================
   Public Route Wrapper
========================= */

function PublicRoute({ children }) {
  const token = useAppStore((state) => state.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* =========================
        App Routes
========================= */

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
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

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["admin", "organizer", "volunteer", "participant"]}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-event"
        element={
          <ProtectedRoute allowedRoles={["organizer", "admin"]}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-events"
        element={
          <ProtectedRoute allowedRoles={["organizer", "admin"]}>
            <MyEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan"
        element={
          <ProtectedRoute allowedRoles={["volunteer", "admin"]}>
            <VolunteerScan />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}