export default function Input({ ...props }) {
  return (
    <input
      {...props}
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
        text-gray-900
        dark:text-white
        placeholder-gray-400
        dark:placeholder-gray-300
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
      "
    />
  );
}