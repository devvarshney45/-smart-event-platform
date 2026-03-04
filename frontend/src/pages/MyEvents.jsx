import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ================= FETCH EVENTS ================= */
  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events?mine=true");
      setEvents(res.data || []);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast.success("Event deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* ================= CSV EXPORT ================= */
  const handleExport = async (eventId) => {
    try {
      const response = await api.get(
        `/admin/export/${eventId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "participants.csv";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("CSV downloaded");

    } catch (err) {
      toast.error("Export failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Events</h2>

        <Button onClick={() => navigate("/dashboard/create-event")}>
          + Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-gray-500 text-center mt-10 text-lg">
          No events created yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => {
            const total = event.totalRegistrations || 0;
            const attended = event.attendedCount || 0;
            const percentage =
              total === 0
                ? 0
                : Math.round((attended / total) * 100);

            return (
              <Card key={event._id}>
                {/* TITLE */}
                <h3 className="font-semibold text-lg mb-2">
                  {event.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-sm mb-3">
                  {event.description}
                </p>

                {/* ANALYTICS */}
                <div className="text-sm space-y-1 mb-3">
                  <p>
                    Registrations:{" "}
                    <span className="font-medium">
                      {total}
                    </span>
                  </p>

                  <p>
                    Attended:{" "}
                    <span className="font-medium">
                      {attended}
                    </span>
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mt-2">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <p className="text-xs font-medium mt-1">
                    {percentage}% Attendance
                  </p>
                </div>

                {/* INFO */}
                <div className="text-sm text-gray-400 space-y-1">
                  <p>
                    Date:{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p>Venue: {event.venue}</p>
                  <p>Capacity: {event.capacity}</p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-4 flex-wrap">
                  <Button
                    onClick={() =>
                      navigate(`/dashboard/edit-event/${event._id}`)
                    }
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() =>
                      navigate(`/dashboard/event/${event._id}/registrations`)
                    }
                    className="bg-green-600"
                  >
                    Registrations
                  </Button>

                  <Button
                    onClick={() => handleExport(event._id)}
                    className="bg-indigo-500"
                  >
                    Export CSV
                  </Button>

                  <Button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}