import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function Scan() {
  const scannerRef = useRef(null);
  const readerId = "reader";

  const [isProcessing, setIsProcessing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  /* ================= START SCANNER ================= */
  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        handleScan
      );

      setIsActive(true);
    } catch (err) {
      console.error("Camera start error:", err);
      toast.error("Camera failed to start");
    }
  };

  /* ================= HANDLE QR SCAN ================= */
  const handleScan = async (decodedText) => {
    if (isProcessing) return;

    setIsProcessing(true);

    let finalValue = decodedText;

    // Handle old JSON QR format
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed?.id) {
        finalValue = parsed.id;
      }
    } catch {
      // Not JSON, ignore
    }

    try {
      const res = await api.post("/attendance", {
        qrIdentifier: finalValue,
      });

      toast.success(res.data.message || "Attendance marked");

      setLastResult({
        success: true,
        message: res.data.message,
      });

      await stopScanner();

    } catch (err) {
      const msg =
        err.response?.data?.message || "Attendance failed";

      toast.error(msg);

      setLastResult({
        success: false,
        message: msg,
      });

      setIsProcessing(false);
    }
  };

  /* ================= STOP SCANNER ================= */
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setIsActive(false);
  };

  /* ================= RESTART ================= */
  const restartScanner = async () => {
    setLastResult(null);
    setIsProcessing(false);
    await stopScanner();
    await startScanner();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Scan Event QR Code
      </h2>

      {/* Scanner View */}
      <div
        id={readerId}
        className="w-full min-h-[300px] rounded-xl overflow-hidden"
      />

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
        Point camera at participant QR code
      </p>

      {/* Result Message */}
      {lastResult && (
        <div
          className={`mt-6 text-center font-semibold ${
            lastResult.success
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {lastResult.message}
        </div>
      )}

      {/* Restart Button */}
      {!isActive && (
        <button
          onClick={restartScanner}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
        >
          Scan Next Participant
        </button>
      )}
    </div>
  );
}