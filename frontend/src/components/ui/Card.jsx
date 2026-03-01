import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`glass rounded-2xl shadow-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}