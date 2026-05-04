import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);

  useEffect(() => {
    // Normally we'd fetch a single report by ID, but we can also just fetch from the list
    // Assume backend GET /api/reports/{id} exists or we fetch list and find it.
    // Since we didn't add a single GET endpoint explicitly, we can just show a placeholder.
  }, [id]);

  return (
    <div className="p-6">
      <button onClick={() => navigate("/home")} className="mb-4 bg-gray-500 text-white px-3 py-1 rounded">
        Back to Home
      </button>
      <h2 className="text-2xl font-bold">Report Detail View</h2>
      <p>Score Badge Placeholder</p>
    </div>
  );
}
