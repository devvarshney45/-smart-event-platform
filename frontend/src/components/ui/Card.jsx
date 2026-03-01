export default function Card({ children }) {
  return (
    <div className="bg-white dark:bg-slate-800 shadow rounded-xl p-6">
      {children}
    </div>
  );
}