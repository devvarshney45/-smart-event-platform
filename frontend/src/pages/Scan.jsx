import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Layout from "../components/layout/Layout";
import api from "../services/axios";

export default function Scan() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          await api.post("/attendance", {
            qrIdentifier: decodedText,
          });
          alert("Attendance marked!");
        } catch {
          alert("Invalid QR");
        }
      },
      () => {}
    );

    return () => scanner.clear();
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Scan QR Code
      </h2>

      <div id="reader" className="max-w-md"></div>
    </Layout>
  );
}