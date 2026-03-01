import { useEffect, useState } from "react";
import api from "../services/axios";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    api.get("/registrations/my")
      .then(res => setRegistrations(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Registrations</h2>

      {registrations.map((reg) => (
        <div key={reg._id} className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">
            {reg.event.title}
          </h3>

          <img
            src={reg.qrImage}
            alt="QR"
            className="w-40 mt-4"
          />
        </div>
      ))}
    </div>
  );
}