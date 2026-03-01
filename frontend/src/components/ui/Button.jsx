export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition"
    >
      {children}
    </button>
  );
}