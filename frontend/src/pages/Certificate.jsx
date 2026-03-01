import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/axios";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";

export default function Certificate() {
  const { id } = useParams();
  const [certificateUrl, setCertificateUrl] = useState("");

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const res = await api.get(`/certificate/${id}`);
        setCertificateUrl(res.data.url);
      } catch {
        alert("Certificate not available");
      }
    }

    fetchCertificate();
  }, [id]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">
        Certificate
      </h2>

      {certificateUrl && (
        <a href={certificateUrl} target="_blank">
          <Button>Download Certificate</Button>
        </a>
      )}
    </Layout>
  );
}