import { useEffect, useState } from "react";
import api from "../services/axios";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // ================= FETCH =================
  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      console.log("Error loading registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();

    // 🔥 Auto refresh every 5 sec (for instant attendance update)
    const interval = setInterval(() => {
      fetchRegistrations();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ================= DOWNLOAD CERTIFICATE =================
  const handleDownload = async (eventId) => {
    try {
      setDownloadingId(eventId);

      const response = await api.get(`/certificate/${eventId}`, {
        responseType: "blob",
      });

      // 🔥 Handle backend JSON error inside blob
      if (response.headers["content-type"]?.includes("application/json")) {
        const text = await response.data.text();
        const json = JSON.parse(text);
        alert(json.message || "Certificate not available");
        return;
      }

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "certificate.pdf";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert("Certificate not available");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-slate-500">
        Loading registrations...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">
        My Registrations
      </h2>

      {registrations.length === 0 ? (
        <div className="text-slate-500">
          No registrations found.
        </div>
      ) : (
        registrations.map((reg) => (
          <div
            key={reg._id}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {reg.event.title}
            </h3>

            <p>
              Status:
              {reg.attended ? (
                <span className="text-green-600 ml-2 font-medium">
                  Attended ✅
                </span>
              ) : (
                <span className="text-red-500 ml-2 font-medium">
                  Not Attended ❌
                </span>
              )}
            </p>

            <img
              src={reg.qrImage}
              alt="QR"
              className="w-40 rounded border"
            />

            {reg.attended && (
              <button
                onClick={() => handleDownload(reg.event._id)}
                disabled={downloadingId === reg.event._id}
                className={`px-4 py-2 rounded-lg transition text-white ${
                  downloadingId === reg.event._id
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {downloadingId === reg.event._id
                  ? "Downloading..."
                  : "Download Certificate"}
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
