import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import api from "../services/axios";

export default function MyEvents() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/registration/my");
        setEvents(res.data);
      } catch {
        setEvents([]);
      }
    }
    fetchData();
  }, []);

  if (!events) return <Loader />;

  if (events.length === 0)
    return (
      <Layout>
        <div className="text-center mt-20 text-slate-500">
          No registrations yet.
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((reg) => (
          <Card key={reg._id}>
            <h3 className="text-xl font-semibold">
              {reg.event.title}
            </h3>
            <p className="text-sm text-slate-500">
              {new Date(reg.event.date).toLocaleDateString()}
            </p>

            {reg.attended && (
              <Button
                className="mt-4"
                onClick={() =>
                  window.open(
                    `http://localhost:5000/api/certificate/${reg.event._id}`,
                    "_blank"
                  )
                }
              >
                Download Certificate
              </Button>
            )}
          </Card>
        ))}
      </div>
    </Layout>
  );
}