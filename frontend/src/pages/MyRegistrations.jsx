import { useEffect, useState } from "react";
import api from "../services/axios";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/registrations/my");
      setRegistrations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        My Registrations
      </h2>

      {registrations.map((reg) => (
        <div
          key={reg._id}
          className="bg-white p-6 rounded shadow space-y-3"
        >
          <h3 className="text-lg font-semibold">
            {reg.event.title}
          </h3>

          {/* Attendance Status */}
          <p>
            Status:
            {reg.attended ? (
              <span className="text-green-600 ml-2">
                Attended ✅
              </span>
            ) : (
              <span className="text-red-500 ml-2">
                Not Attended ❌
              </span>
            )}
          </p>

          {/* QR Code */}
          <img
            src={reg.qrImage}
            alt="QR"
            className="w-40"
          />

          {/* Certificate Button */}
          {reg.attended && (
            <button
              onClick={() =>
                window.open(
                  `/api/certificate/${reg.event._id}`,
                  "_blank"
                )
              }
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Download Certificate
            </button>
          )}
        </div>
      ))}
    </div>
  );
}