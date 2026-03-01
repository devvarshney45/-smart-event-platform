import { Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "../app/store";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import CreateEvent from "../pages/CreateEvent";
import MyEvents from "../pages/MyEvents";
import VolunteerScan from "../pages/VolunteerScan";

function ProtectedRoute({ children }) {
  const token = useAppStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-event"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-events"
        element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <VolunteerScan />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}