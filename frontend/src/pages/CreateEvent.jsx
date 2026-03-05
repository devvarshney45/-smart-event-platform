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

    /* ================= VALIDATION ================= */

    if (!form.title || !form.date || !form.deadline) {
      return toast.error("Please fill all required fields");
    }

    if (new Date(form.deadline) > new Date(form.date)) {
      return toast.error(
        "Registration deadline cannot be after event date"
      );
    }

    try {

      await api.post("/events", {
        ...form,
        capacity: Number(form.capacity),
      });

      toast.success("Event created successfully!");

      navigate("/dashboard/my-events");

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Event creation failed"
      );

    }

  };

  return (

    <FadeIn>

      <div className="max-w-xl mx-auto">

        <h2 className="text-2xl font-bold mb-6">
          Create Event
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Title */}

          <div>

            <label className="text-sm font-medium">
              Event Title
            </label>

            <Input
              placeholder="Enter event title"
              value={form.title}
              onChange={(e) =>
                handleChange("title", e.target.value)
              }
            />

          </div>


          {/* Description */}

          <div>

            <label className="text-sm font-medium">
              Description
            </label>

            <Input
              placeholder="Short event description"
              value={form.description}
              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value
                )
              }
            />

          </div>


          {/* Event Date */}

          <div>

            <label className="text-sm font-medium">
              Event Date
            </label>

            <Input
              type="date"
              value={form.date}
              onChange={(e) =>
                handleChange("date", e.target.value)
              }
            />

            <p className="text-xs text-gray-500 mt-1">
              Date when the event will take place
            </p>

          </div>


          {/* Venue */}

          <div>

            <label className="text-sm font-medium">
              Venue
            </label>

            <Input
              placeholder="Event location"
              value={form.venue}
              onChange={(e) =>
                handleChange("venue", e.target.value)
              }
            />

          </div>


          {/* Capacity */}

          <div>

            <label className="text-sm font-medium">
              Participant Capacity
            </label>

            <Input
              type="number"
              placeholder="Maximum participants"
              value={form.capacity}
              onChange={(e) =>
                handleChange(
                  "capacity",
                  e.target.value
                )
              }
            />

          </div>


          {/* Registration Deadline */}

          <div>

            <label className="text-sm font-medium">
              Registration Deadline
            </label>

            <Input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                handleChange(
                  "deadline",
                  e.target.value
                )
              }
            />

            <p className="text-xs text-gray-500 mt-1">
              Last date participants can register
            </p>

          </div>


          {/* Button */}

          <Button type="submit">
            Create Event
          </Button>

        </form>

      </div>

    </FadeIn>

  );

}