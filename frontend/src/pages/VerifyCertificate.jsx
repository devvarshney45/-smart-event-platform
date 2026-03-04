import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/axios";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";

export default function VerifyCertificate() {
  const { certId } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/admin/verify/${certId}`);
        setData(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Invalid Certificate ID"
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [certId]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-100 dark:bg-slate-900">
      <Card className="max-w-md w-full text-center p-8">
        <h2 className="text-2xl font-bold mb-4">
          Certificate Verification
        </h2>

        {error ? (
          <div className="text-red-500 font-medium">
            ❌ {error}
          </div>
        ) : (
          <>
            <div className="text-green-600 text-lg font-semibold mb-4">
              ✅ Certificate Verified
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <p>
                <span className="font-medium">Participant:</span>{" "}
                {data.participant}
              </p>

              <p>
                <span className="font-medium">Event:</span>{" "}
                {data.event}
              </p>

              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(data.date).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}