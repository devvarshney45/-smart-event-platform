import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function Scan() {
  const scannerRef = useRef(null);
  const readerId = "reader";

  const [scanning, setScanning] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setScanning(false);

      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          if (scanning) return;

          setScanning(true);

          console.log("RAW QR:", decodedText);

          // 🔥 Handle JSON QR and plain UUID
          let finalValue = decodedText;

          try {
            const parsed = JSON.parse(decodedText);
            if (parsed.id) {
              finalValue = parsed.id;
            }
          } catch {
            // ignore if not JSON
          }

          console.log("Final QR Value:", finalValue);

          try {
            const res = await api.post("/attendance", {
              qrIdentifier: finalValue,
            });

            toast.success(res.data.message || "Attendance Marked");

            await stopScanner();
          } catch (err) {
            console.log("Attendance error:", err.response?.data);

            toast.error(
              err.response?.data?.message || "Attendance failed"
            );

            setScanning(false);
          }
        }
      );

      setActive(true);
    } catch (err) {
      console.error("Camera start error:", err);
      toast.error("Camera failed to start");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setActive(false);
  };

  const restartScanner = async () => {
    await stopScanner();
    await startScanner();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Scan Event QR Code
      </h2>

      <div
        id={readerId}
        className="w-full min-h-[300px] rounded-xl overflow-hidden"
      />

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
        Point camera at participant QR code
      </p>

      {!active && (
        <button
          onClick={restartScanner}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          Restart Scanner
        </button>
      )}
    </div>
  );
}