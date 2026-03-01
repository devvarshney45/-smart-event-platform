import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import FadeIn from "../components/animations/FadeIn";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-hero-gradient">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold max-w-4xl leading-tight"
        >
          Smart Event Management Made{" "}
          <span className="text-primary">Effortless</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl"
        >
          Manage registrations, track attendance with QR, generate certificates,
          and analyze event data — all in one platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex gap-4"
        >
          <Button onClick={() => navigate("/login")}>
            Get Started <ArrowRight size={18} className="inline ml-2" />
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/register")}
          >
            Create Account
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <FadeIn>
            <Card>
              <CheckCircle className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Secure Authentication
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                JWT-based secure login with role-based access control.
              </p>
            </Card>
          </FadeIn>

          <FadeIn>
            <Card>
              <CheckCircle className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                QR Attendance System
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Instantly mark attendance using secure QR scanning.
              </p>
            </Card>
          </FadeIn>

          <FadeIn>
            <Card>
              <CheckCircle className="text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Real-time Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Track event registrations and attendance percentage.
              </p>
            </Card>
          </FadeIn>
        </div>
      </section>

      <FAQSection />

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <FadeIn>
          <h2 className="text-4xl font-bold mb-6">
            Ready to simplify your events?
          </h2>
          <Button onClick={() => navigate("/register")}>
            Start Now
          </Button>
        </FadeIn>
      </section>

      <footer className="py-10 text-center text-slate-500 dark:text-slate-400">
        © 2025 SmartEvent. All rights reserved.
      </footer>
    </div>
  );
}

/* FAQ Component */
function FAQSection() {
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

  const [active, setActive] = useState(null);

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
              className="overflow-hidden text-slate-600 dark:text-slate-300 mt-2"
            >
              {faq.answer}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}