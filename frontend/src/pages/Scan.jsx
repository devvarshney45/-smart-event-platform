import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function Scan() {
  const scannerRef = useRef(null);
  const readerId = "reader";
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const startScanner = async () => {
      try {
        if (scannerRef.current) {
          try { await scannerRef.current.stop(); } catch {}
          try { await scannerRef.current.clear(); } catch {}
          scannerRef.current = null;
        }

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

            // 🔥 prevent multiple scans
            if (scanning) return;
            setScanning(true);

            console.log("QR Detected:", decodedText);

            try {
              const res = await api.post("/attendance", {
                qrIdentifier: decodedText,
              });

              console.log("Attendance Response:", res.data);
              toast.success(res.data.message);

              await scanner.stop();
              await scanner.clear();

            } catch (err) {
              console.log("Attendance Error:", err.response?.data);

              toast.error(
                err.response?.data?.message ||
                "Attendance failed"
              );

              setScanning(false);
            }
          }
        );

      } catch (err) {
        console.error("Camera error:", err);
        toast.error("Camera failed to start");
      }
    };

    startScanner();

    return () => {
      const cleanup = async () => {
        if (scannerRef.current) {
          try { await scannerRef.current.stop(); } catch {}
          try { await scannerRef.current.clear(); } catch {}
          scannerRef.current = null;
        }
      };
      cleanup();
    };
  }, []);

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
    </div>
  );
}