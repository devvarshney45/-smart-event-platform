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
        // 🔥 IMPORTANT: clear old instance if exists
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

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          toast.error("No camera found");
          return;
        }

        await scanner.start(
          cameras[0].id,
          {
            fps: 10,
            qrbox: 250,
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            try {
              await api.post("/attendance", {
                qrIdentifier: decodedText,
              });

              toast.success("Attendance Marked!");

              // stop after successful scan
              await scanner.stop();
              await scanner.clear();
            } catch {
              toast.error("Invalid QR");
            }
          }
        );
      } catch (err) {
        console.error(err);
        toast.error("Camera failed to start");
      }
    };

    startScanner();

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