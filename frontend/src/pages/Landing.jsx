import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  QrCode,
  BarChart3,
  Users,
} from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import FadeIn from "../components/animations/FadeIn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-black">

      <Navbar />

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-black">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold max-w-5xl text-slate-800 dark:text-white"
        >
          Smart Event Management Made{" "}
          <span className="text-indigo-600">Effortless</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl"
        >
          Manage registrations, track QR attendance, generate certificates,
          and analyze event data — all from one powerful platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >

          <button
            onClick={() => navigate("/login")}
            className="group px-8 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center gap-2 hover:scale-105 transition"
          >
            Get Started
            <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Create Account
          </button>

        </motion.div>

      </section>

      {/* STATS */}

      <section className="py-20 bg-slate-50 dark:bg-slate-900">

        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <Stat number="10K+" label="Registrations" />
          <Stat number="500+" label="Events Hosted" />
          <Stat number="99%" label="Attendance Accuracy" />
          <Stat number="24/7" label="Platform Access" />

        </div>

      </section>

      {/* FEATURES */}

      <section className="py-24 px-6 bg-white dark:bg-slate-950">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Powerful Features</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-3">
            Everything you need to manage events efficiently
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          <Feature
            icon={<ShieldCheck />}
            title="Secure Authentication"
            desc="JWT authentication with role-based access control."
          />

          <Feature
            icon={<QrCode />}
            title="QR Attendance"
            desc="Scan QR codes to mark attendance instantly."
          />

          <Feature
            icon={<BarChart3 />}
            title="Real-time Analytics"
            desc="Monitor registrations and attendance metrics."
          />

        </div>

      </section>

      {/* ROLES */}

      <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Built for Every Role
          </h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">

          <RoleCard title="Admin" desc="Manage users, events and analytics." />
          <RoleCard title="Organizer" desc="Create and manage events." />
          <RoleCard title="Volunteer" desc="Scan QR codes for attendance." />
          <RoleCard title="Participant" desc="Register & download certificates." />

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="py-24 px-6 bg-white dark:bg-black">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            How It Works
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">

          <Step number="1" text="Create account & login securely." />
          <Step number="2" text="Register for events and get QR." />
          <Step number="3" text="Attend event & download certificate." />

        </div>

      </section>

      <FAQSection />

      {/* CTA */}

      <section className="py-24 text-center bg-indigo-600 text-white">

        <h2 className="text-4xl font-bold">
          Start Managing Events Today
        </h2>

        <p className="mt-4 opacity-90">
          Join thousands of organizers and participants
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-8 px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:scale-105 transition"
        >
          Create Free Account
        </button>

      </section>

      <footer className="py-10 text-center text-slate-500 dark:text-slate-400">
        © 2025 SmartEvent. All rights reserved.
      </footer>

    </div>
  );
}

/* STAT */

function Stat({ number, label }) {
  return (
    <div>
      <h3 className="text-4xl font-bold text-indigo-600">{number}</h3>
      <p className="text-slate-500">{label}</p>
    </div>
  );
}

/* FEATURE */

function Feature({ icon, title, desc }) {
  return (
    <FadeIn>
      <Card className="hover:scale-105 transition">
        <div className="text-indigo-600 mb-4">{icon}</div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{desc}</p>
      </Card>
    </FadeIn>
  );
}

/* ROLE CARD */

function RoleCard({ title, desc }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card>
        <Users className="text-indigo-600 mb-4" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300 mt-2">{desc}</p>
      </Card>
    </motion.div>
  );
}

/* STEP */

function Step({ number, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-xl border dark:border-slate-700"
    >
      <h3 className="text-3xl font-bold text-indigo-600">{number}</h3>
      <p className="mt-3 text-slate-600 dark:text-slate-300">{text}</p>
    </motion.div>
  );
}

/* FAQ */

function FAQSection() {

  const [active, setActive] = useState(null);

  const faqs = [
    {
      question: "How secure is the system?",
      answer:
        "JWT authentication and password hashing ensures secure access."
    },
    {
      question: "Can certificates be verified?",
      answer:
        "Yes, certificates include QR and unique verification IDs."
    },
    {
      question: "Is the system scalable?",
      answer:
        "The architecture supports scaling and secure deployment."
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-100 dark:bg-slate-900">

      <div className="max-w-3xl mx-auto">

        <h2 className="text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>

        {faqs.map((faq, index) => (

          <div key={index} className="mb-4 border-b pb-4">

            <button
              onClick={() => setActive(active === index ? null : index)}
              className="w-full text-left font-semibold"
            >
              {faq.question}
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: active === index ? "auto" : 0,
                opacity: active === index ? 1 : 0
              }}
              className="overflow-hidden mt-2 text-slate-600 dark:text-slate-300"
            >
              {faq.answer}
            </motion.div>

          </div>

        ))}

      </div>

    </section>
  );
}