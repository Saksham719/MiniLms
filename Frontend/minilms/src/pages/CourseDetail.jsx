import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useParams, Link } from "react-router-dom";
import { listMaterials } from "../api/materials";

export default function CourseDetail() {
  const { id } = useParams();

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => (await api.get(`/courses/${id}`)).data,
  });

  const { data: mats, isLoading: matsLoading } = useQuery({
    queryKey: ["materials", id],
    queryFn: async () => (await listMaterials(id)).data,
  });

  if (!course) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">{course.title}</h2>
          <p className="page-sub">
            {course.category} · {course.level} · {course.durationMinutes} mins
          </p>
        </div>
        <Link to="/catalog" className="btn btn-ghost">← Back</Link>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="page-sub" style={{ marginBottom: 8 }}>Description</div>
        <p>{course.description || "No description"}</p>
      </div>

      <div className="card">
        <div className="page-sub" style={{ marginBottom: 8 }}>Materials</div>
        {matsLoading && <div className="empty">Loading materials…</div>}
        {!matsLoading && (!mats || mats.length === 0) && <div className="empty">No materials yet.</div>}
        {!matsLoading && mats?.length > 0 && (
          <ul style={{ display:"grid", gap: 10, paddingLeft: 18 }}>
            {mats.map(m => (
              <li key={m.id}>
                <strong>{m.title}</strong>{" "}
                <span className="muted">({m.type})</span>{" "}
                {m.type === "url"
                  ? <a href={m.location} target="_blank" rel="noreferrer">Open</a>
                  : <a href={m.location} target="_blank" rel="noreferrer">Download</a>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
