import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FadeIn from "../components/animations/FadeIn";
import { useAppStore } from "../app/store";

export default function Register() {
  const navigate = useNavigate();
  const { setUser, setToken } = useAppStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);

      // ✅ Save auth state immediately
      setUser(res.data.user);
      setToken(res.data.token);

      // ✅ Go directly to dashboard
      navigate("/dashboard");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <FadeIn>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow w-96 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center">Register</h2>

          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Button type="submit">Register</Button>
        </form>
      </FadeIn>
    </div>
  );
}
