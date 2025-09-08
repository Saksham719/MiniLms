import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useParams } from "react-router-dom";

export default function CourseDetail() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => (await api.get(`/courses/${id}`)).data,
  });
  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;
  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>{data.title}</h2>
      <div style={{ opacity: 0.8, marginBottom: 10 }}>
        {data.category} · {data.level} · {data.durationMinutes} mins
      </div>
      <p>{data.description || "No description"}</p>
    </div>
  );
}
