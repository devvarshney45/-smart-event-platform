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

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        handleScan
      );

      setIsActive(true);
    } catch (err) {
      console.error(err);
      toast.error("Camera failed to start");
    }
  };

  const handleScan = async (decodedText) => {
    // 🔥 Hard protection against double scan
    if (isProcessing || !isActive) return;

    setIsProcessing(true);

    let finalValue = decodedText;

    try {
      const parsed = JSON.parse(decodedText);
      if (parsed?.id) {
        finalValue = parsed.id;
      }
    } catch {}

    try {
      const res = await api.post("/attendance", {
        qrIdentifier: finalValue,
      });

      toast.success(res.data.message || "Attendance marked");

      setLastResult({
        success: true,
        message: res.data.message,
      });

      // Small delay so scanner doesn’t fire twice
      setTimeout(async () => {
        await stopScanner();
      }, 300);

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

      <div
        id={readerId}
        className="w-full min-h-[300px] rounded-xl overflow-hidden"
      />

      <p className="text-sm text-gray-500 text-center mt-4">
        Point camera at participant QR code
      </p>

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