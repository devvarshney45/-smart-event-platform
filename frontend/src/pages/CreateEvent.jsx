import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FadeIn from "../components/animations/FadeIn";
import toast from "react-hot-toast";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: "",
    deadline: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/events", {
        ...form,
        capacity: Number(form.capacity),
      });

      toast.success("Event created successfully!");
      navigate("/dashboard/my-events");

    } catch (err) {
      toast.error(
        err.response?.data?.message || "Event creation failed"
      );
    }
  };

  return (
    <FadeIn>
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Create Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <Input
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />

          <Input
            placeholder="Venue"
            value={form.venue}
            onChange={(e) => handleChange("venue", e.target.value)}
          />

          <Input
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => handleChange("capacity", e.target.value)}
          />

          <Input
            type="date"
            value={form.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
          />

          <Button type="submit">
            Create Event
          </Button>
        </form>
      </div>
    </FadeIn>
  );
}