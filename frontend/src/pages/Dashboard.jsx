import { useEffect, useState } from "react";
import api from "../services/axios";
import Layout from "../components/layout/Layout";
import Card from "../components/ui/Card";
import Loader from "../components/ui/Loader";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch {
        setStats({
          totalUsers: 0,
          totalEvents: 0,
          totalRegistrations: 0,
        });
      }
    }

    fetchStats();
  }, []);

  if (!stats) return <Loader />;

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <Card>
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold mt-2 text-primary">
            {stats.totalUsers}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">Total Events</h3>
          <p className="text-3xl font-bold mt-2 text-primary">
            {stats.totalEvents}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">Registrations</h3>
          <p className="text-3xl font-bold mt-2 text-primary">
            {stats.totalRegistrations}
          </p>
        </Card>
      </motion.div>
    </Layout>
  );
}