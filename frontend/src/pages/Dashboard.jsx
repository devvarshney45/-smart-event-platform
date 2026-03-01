import { useEffect, useState } from "react";
import api from "../services/axios";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import FadeIn from "../components/animations/FadeIn";
import { useAppStore } from "../app/store";

export default function Dashboard() {
  const user = useAppStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        if (user?.role === "admin") {
          const res = await api.get("/admin/stats");
          setAdminStats(res.data);
        }

        if (
          user?.role === "organizer" ||
          user?.role === "participant"
        ) {
          const res = await api.get("/events");
          setEvents(res.data);
        }
      } catch (err) {
        console.log("Dashboard load error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <FadeIn>
      {/* PAGE HEADING */}
      <h2 className="text-2xl font-bold mb-6">
        Welcome, {user?.name}
      </h2>

      {/* ================= ADMIN ================= */}
      {user?.role === "admin" && adminStats && (
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-semibold">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {adminStats.totalUsers}
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">
              Total Events
            </h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {adminStats.totalEvents}
            </p>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold">
              Registrations
            </h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {adminStats.totalRegistrations}
            </p>
          </Card>
        </div>
      )}

      {/* ================= ORGANIZER ================= */}
      {user?.role === "organizer" && (
        <>
          <h3 className="text-xl font-semibold mb-4">
            Your Events
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event._id}>
                  <h4 className="font-semibold text-lg">
                    {event.title}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {event.description}
                  </p>
                </Card>
              ))
            ) : (
              <p className="text-slate-500">
                No events found.
              </p>
            )}
          </div>
        </>
      )}

      {/* ================= PARTICIPANT ================= */}
      {user?.role === "participant" && (
        <>
          <h3 className="text-xl font-semibold mb-4">
            Available Events
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event._id}>
                  <h4 className="font-semibold text-lg">
                    {event.title}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {event.description}
                  </p>

                  <button
                    onClick={async () => {
                      try {
                        await api.post(
                          `/registrations/${event._id}`
                        );
                        alert("Registered successfully!");
                      } catch {
                        alert("Already registered");
                      }
                    }}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                  >
                    Register
                  </button>
                </Card>
              ))
            ) : (
              <p className="text-slate-500">
                No events available.
              </p>
            )}
          </div>
        </>
      )}

      {/* ================= VOLUNTEER ================= */}
      {user?.role === "volunteer" && (
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