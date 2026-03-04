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

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const res = await api.post("/auth/register", form);

      setUser(res.data.user);
      setToken(res.data.token);

      navigate("/dashboard", { replace: true });

    } catch (err) {

      alert(err.response?.data?.message || "Registration failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">

      <FadeIn>

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            dark:bg-slate-800
            p-8
            rounded-xl
            shadow-lg
            w-full
            max-w-md
            space-y-5
          "
        >

          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
            Register
          </h2>

          {/* Name */}

          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Email */}

          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/* Password */}

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="
                w-full
                px-4
                py-2
                rounded-lg
                border
                border-gray-300
                dark:border-slate-600
                bg-white
                dark:bg-slate-700
                text-black
                dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-gray-500
                dark:text-gray-300
              "
            >
              {showPassword ? "🙈" : "👁"}
            </button>

          </div>

          {/* Button */}

          <Button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </Button>

        </form>

      </FadeIn>

    </div>

  );

}