import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
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
      <section
        className="
        min-h-screen
        flex
        flex-col
        justify-center
        items-center
        text-center
        px-6
        pt-16
        bg-gradient-to-br
        from-indigo-50
        via-white
        to-purple-50
        dark:from-slate-900
        dark:via-slate-950
        dark:to-black
      "
      >

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold max-w-5xl text-slate-800 dark:text-white leading-tight"
        >
          Smart Event Management Made{" "}
          <span className="text-indigo-600">Effortless</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
        >
          Manage registrations, track attendance with QR, generate certificates,
          and analyze event data — all in one powerful platform.
        </motion.p>

        {/* ✅ Modern Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >

          {/* Primary Button */}
          <button
            onClick={() => navigate("/login")}
            className="
              group
              px-8 py-3
              rounded-xl
              bg-black
              text-white
              dark:bg-white
              dark:text-black
              font-medium
              flex items-center justify-center gap-2
              transition-all duration-300
              hover:scale-105
              hover:shadow-xl
            "
          >
            Get Started
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => navigate("/register")}
            className="
              px-8 py-3
              rounded-xl
              border border-slate-300
              dark:border-slate-700
              font-medium
              transition-all duration-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              hover:shadow-md
            "
          >
            Create Account
          </button>

        </motion.div>

      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

          <FadeIn>
            <Card>
              <CheckCircle className="text-indigo-600 mb-4" size={28} />
              <h3 className="text-2xl font-semibold mb-2">
                Secure Authentication
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                JWT-based secure login with role-based access control.
              </p>
            </Card>
          </FadeIn>

          <FadeIn>
            <Card>
              <CheckCircle className="text-indigo-600 mb-4" size={28} />
              <h3 className="text-2xl font-semibold mb-2">
                QR Attendance System
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Instantly mark attendance using secure QR scanning.
              </p>
            </Card>
          </FadeIn>

          <FadeIn>
            <Card>
              <CheckCircle className="text-indigo-600 mb-4" size={28} />
              <h3 className="text-2xl font-semibold mb-2">
                Real-time Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Track registrations and attendance percentage in real-time.
              </p>
            </Card>
          </FadeIn>

        </div>
      </section>

      <FAQSection />

      <footer className="py-10 text-center text-slate-500 dark:text-slate-400">
        © 2025 SmartEvent. All rights reserved.
      </footer>

    </div>
  );
}

/* FAQ */
function FAQSection() {
  const [active, setActive] = useState(null);

  const faqs = [
    {
      question: "How secure is the system?",
      answer:
        "We use JWT authentication and server-side validations to ensure maximum security.",
    },
    {
      question: "Can I generate certificates?",
      answer:
        "Yes, certificates are automatically generated for attendees.",
    },
    {
      question: "Is it mobile responsive?",
      answer:
        "Absolutely! The platform is fully responsive across devices.",
    },
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
                opacity: active === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
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