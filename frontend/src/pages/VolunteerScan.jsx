import { useEffect, useRef } from "react";
import Layout from "../components/layout/Layout";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function VolunteerScan() {
  const qrRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        await scannerRef.current.start(
          { facingMode: "environment" }, // back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            try {
              await api.post("/attendance", {
                qrIdentifier: decodedText,
              });

              toast.success("✅ Attendance Marked!");
              await scannerRef.current.stop();
            } catch (err) {
              toast.error("❌ Invalid or Already Scanned QR");
            }
          },
          (errorMessage) => {
            // ignore continuous scan errors
          }
        );
      } catch (err) {
        toast.error("Camera access denied");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Scan Event QR Code
        </h2>

        <div
          id="reader"
          ref={qrRef}
          className="w-full rounded-xl overflow-hidden"
        ></div>

        <p className="text-sm text-gray-500 text-center mt-4">
          Point camera at participant QR code
        </p>
      </motion.div>
    </Layout>
  );
}