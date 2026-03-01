import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppStore } from "./app/store";
import useTheme from "./hooks/useTheme";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const theme = useAppStore((state) => state.theme);
  useTheme(theme);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-hero-gradient">
        <AppRoutes />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;