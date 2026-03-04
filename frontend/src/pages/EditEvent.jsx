import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function EditEvent() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: "",
    deadline: ""
  });

  /* ================= LOAD EVENT ================= */

  useEffect(() => {

    const fetchEvent = async () => {

      try {

        const res = await api.get("/events?mine=true");

        const event = res.data.find(e => e._id === id);

        if (!event) {
          toast.error("Event not found");
          navigate("/dashboard/my-events");
          return;
        }

        setForm({
          title: event.title,
          description: event.description,
          date: event.date?.substring(0,10),
          venue: event.venue,
          capacity: event.capacity,
          deadline: event.deadline?.substring(0,10)
        });

      } catch (err) {

        toast.error("Failed to load event");

      } finally {

        setLoading(false);

      }

    };

    fetchEvent();

  }, [id]);


  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await api.put(`/events/${id}`, form);

      toast.success("Event updated");

      navigate("/dashboard/my-events");

    } catch (err) {

      toast.error("Update failed");

    }

  };


  if (loading) return <div className="p-6">Loading...</div>;


  return (
    <div className="max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        Edit Event
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="Venue"
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Update Event
        </button>

      </form>

    </div>
  );

}