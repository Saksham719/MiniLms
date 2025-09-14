import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { Link, useParams } from "react-router-dom";

export default function CourseDetail() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => (await api.get(`/courses/${id}`)).data,
  });

  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>{data.title}</h2>
      <div style={{ opacity: 0.8, marginBottom: 20 }}>
        {data.category} · {data.level} · {data.durationMinutes} mins
      </div>
      <p style={{ marginBottom: 20 }}>
        {data.description || "No description"}
      </p>

      {/* Fixed Back Button */}
      <Link to="/catalog" className="btn btn-back" style={{ marginTop: 30 }}>
        ← Back
      </Link>
    </div>
  );
}
