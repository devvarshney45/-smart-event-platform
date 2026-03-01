import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-2xl font-semibold 
      bg-gradient-to-r from-primary to-indigo-600 
      text-white shadow-lg hover:shadow-glow 
      transition-all duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
}