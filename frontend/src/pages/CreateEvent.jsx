import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function CreateEvent() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    capacity: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", form);
      toast.success("Event Created Successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating event");
    }
  };

  return (
    <Layout>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl max-w-xl mx-auto space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>

        {Object.keys(form).map((key) => (
          <Input
            key={key}
            label={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={`Enter ${key}`}
          />
        ))}

        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </motion.form>
    </Layout>
  );
}