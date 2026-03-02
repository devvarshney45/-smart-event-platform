import { useEffect, useState } from "react";
import api from "../services/axios";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import FadeIn from "../components/animations/FadeIn";
import { useAppStore } from "../app/store";
import toast from "react-hot-toast";

export default function Dashboard() {
  const user = useAppStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);

  /* ================= LOAD DATA (CORRECT) ================= */
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);

        if (user.role === "admin") {
          const res = await api.get("/admin/stats");
          setAdminStats(res.data);
        }

        if (["organizer", "participant"].includes(user.role)) {
          const res = await api.get("/events");
          setEvents(res.data);
        }

        if (user.role === "participant") {
          const res = await api.get("/registrations/my");
          setMyRegistrations(res.data);
        }

      } catch (err) {
        console.log("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]); // ✅ dependency added back

  if (!user || loading) return <Loader />;

  const isRegistered = (eventId) =>
    myRegistrations.some((reg) => reg.event?._id === eventId);

  /* ================= INSTANT REGISTER ================= */
  const handleRegister = async (eventId) => {
    try {
      const res = await api.post(`/registrations/${eventId}`);
      toast.success(res.data.message);

      // Optimistic UI update
      setMyRegistrations((prev) => [
        ...prev,
        { event: { _id: eventId } }
      ]);

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <FadeIn>
      <h2 className="text-2xl font-bold mb-6">
        Welcome, {user?.name}
      </h2>

      {/* ================= ADMIN ================= */}
      {user.role === "admin" && adminStats && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3>Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {adminStats.totalUsers}
            </p>
          </Card>

          <Card>
            <h3>Total Events</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {adminStats.totalEvents}
            </p>
          </Card>

          <Card>
            <h3>Registrations</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {adminStats.totalRegistrations}
            </p>
          </Card>
        </div>
      )}

      {/* ================= PARTICIPANT ================= */}
      {user.role === "participant" && (
        <>
          <h3 className="text-xl font-semibold mb-4">
            Available Events
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event._id}>
                <h4 className="font-semibold text-lg">
                  {event.title}
                </h4>

                <p className="text-sm text-slate-500">
                  {event.description}
                </p>

                <button
                  disabled={isRegistered(event._id)}
                  onClick={() => handleRegister(event._id)}
                  className={`mt-4 px-4 py-2 rounded-lg transition ${
                    isRegistered(event._id)
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isRegistered(event._id)
                    ? "Already Registered"
                    : "Register"}
                </button>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ================= ORGANIZER ================= */}
      {user.role === "organizer" && (
        <>
          <h3 className="text-xl font-semibold mb-4">
            Your Events
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event._id}>
                <h4 className="font-semibold text-lg">
                  {event.title}
                </h4>
                <p className="text-sm text-slate-500">
                  {event.description}
                </p>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ================= VOLUNTEER ================= */}
      {user.role === "volunteer" && (
        <Card>
          <h3 className="text-xl font-semibold">
            QR Attendance Scanner
          </h3>
          <p className="text-slate-500 mt-2">
            Use the Scan page to mark attendance.
          </p>
        </Card>
      )}
    </FadeIn>
  );
            }
