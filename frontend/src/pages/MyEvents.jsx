import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const res = await api.get("/events?mine=true");
        setEvents(res.data || []);
      } catch (err) {
        console.log("Error loading events");
      } finally {
        setLoading(false);
      }
    }

    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
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
          {events.map((event) => (
            <Card key={event._id}>
              <h3 className="font-semibold text-lg mb-2">
                {event.title || "Untitled Event"}
              </h3>

              <p className="text-gray-500 text-sm mb-3">
                {event.description || "No description available"}
              </p>

              <div className="text-sm text-gray-400 space-y-1">
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  <span className="font-medium">Venue:</span>{" "}
                  {event.venue || "N/A"}
                </p>

                <p>
                  <span className="font-medium">Capacity:</span>{" "}
                  {event.capacity || "N/A"}
                </p>

                <p>
                  <span className="font-medium">Deadline:</span>{" "}
                  {event.deadline
                    ? new Date(event.deadline).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

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
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}