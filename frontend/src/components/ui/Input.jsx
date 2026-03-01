export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-3 rounded-xl bg-white dark:bg-slate-800 
        border border-slate-300 dark:border-slate-700
        focus:outline-none focus:ring-2 focus:ring-primary
        transition-all duration-300"
      />
    </div>
  );
}