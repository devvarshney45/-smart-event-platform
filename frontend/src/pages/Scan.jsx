import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function Scan() {
  const scannerRef = useRef(null);
  const readerId = "reader";

  useEffect(() => {
    const startScanner = async () => {
      try {
        // 🔥 Cleanup old scanner if exists
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch {}
          try {
            await scannerRef.current.clear();
          } catch {}
          scannerRef.current = null;
        }

        const scanner = new Html5Qrcode(readerId);
        scannerRef.current = scanner;

        // 🔥 FORCE BACK CAMERA USING facingMode
        await scanner.start(
          { facingMode: "environment" }, 
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            try {
              await api.post("/attendance", {
                qrIdentifier: decodedText,
              });

              toast.success("Attendance Marked!");

              // Stop after successful scan
              await scanner.stop();
              await scanner.clear();
            } catch (err) {
              toast.error("Invalid or Already Scanned QR");
            }
          }
        );

      } catch (err) {
        console.error(err);
        toast.error("Camera failed to start");
      }
    };

    startScanner();

    // 🔥 Cleanup when component unmount
    return () => {
      const cleanup = async () => {
        if (scannerRef.current) {
          try {
            await scannerRef.current.stop();
          } catch {}
          try {
            await scannerRef.current.clear();
          } catch {}
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
      ></div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
        Point camera at participant QR code
      </p>
    </div>
  );
}