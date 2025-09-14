import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CourseCatalog() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const { data } = useQuery({
    queryKey: ["courses", q, category],
    queryFn: async () => {
      const r = await api.get("/courses", { params: { search: q || undefined, category: category || undefined } });
      return r.data;
    },
  });

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      <h2>Courses</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
        <input placeholder="Category..." value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
        {data?.items?.map((c) => (
          <div key={c.id} className="card" style={{ position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <h3>{c.title}</h3>
                <p style={{ color: "var(--text-secondary)" }}>{c.category} · {c.level}</p>
              </div>
              <Link to={`/courses/${c.id}`} className="btn btn-view">View</Link>
            </div>
            <p>{c.description?.slice(0, 100)}...</p>
          </div>
        ))}
        {!data?.items?.length && <div className="empty">No courses available</div>}
      </div>
    </div>
    
  );
}
