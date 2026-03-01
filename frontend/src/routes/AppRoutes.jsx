import { Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "../app/store";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateEvent from "../pages/CreateEvent";
import MyEvents from "../pages/MyEvents";
import Scan from "../pages/Scan";
import Certificate from "../pages/Certificate";

function ProtectedRoute({ children, allowedRoles }) {
  const token = useAppStore((state) => state.token);
  const user = useAppStore((state) => state.user);

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const token = useAppStore((state) => state.token);
  return token ? <Navigate to="/dashboard" replace /> : children;
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />

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
            allowedRoles={[
              "admin",
              "organizer",
              "volunteer",
              "participant",
            ]}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-event"
        element={
          <ProtectedRoute allowedRoles={["admin", "organizer"]}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-events"
        element={
          <ProtectedRoute allowedRoles={["admin", "organizer"]}>
            <MyEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan"
        element={
          <ProtectedRoute allowedRoles={["admin", "volunteer"]}>
            <Scan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/certificate/:id"
        element={
          <ProtectedRoute allowedRoles={["participant", "admin"]}>
            <Certificate />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}