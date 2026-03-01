import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/axios";
import toast from "react-hot-toast";

export default function Scan() {
  const readerRef = useRef(null);
  const scannerRef = useRef(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!readerRef.current) return;
    if (isStarting) return;

    setIsStarting(true);

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        // Get available cameras
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          toast.error("No camera found");
          return;
        }

        // Prefer rear/external camera if exists
        const rearCamera =
          cameras.find((cam) =>
            cam.label.toLowerCase().includes("back")
          ) || cameras[0];

        await scanner.start(
          rearCamera.id,
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

              toast.success("Attendance Marked Successfully!");

              if (scanner.getState() === 2) {
                await scanner.stop();
              }
            } catch (err) {
              toast.error("Invalid or Already Scanned QR");
            }
          },
          () => {}
        );
      } catch (err) {
        console.error("Camera start error:", err);
        toast.error("Camera failed to start");
      }
    };

    // Small delay helps hardware initialize
    setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      if (
        scannerRef.current &&
        scannerRef.current.getState() === 2
      ) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [isStarting]);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-6">
        Scan Event QR Code
      </h2>

      <div
        id="reader"
        ref={readerRef}
        className="w-full min-h-[320px] rounded-xl overflow-hidden"
      ></div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
        Point camera at participant QR code
      </p>
    </div>
  );
}