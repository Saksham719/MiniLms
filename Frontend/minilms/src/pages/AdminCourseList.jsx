import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminCourseList() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => (await api.get("/courses")).data,
  });

  const remove = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await api.delete(`/courses/${id}`);
    toast.success("Course deleted successfully");
    qc.invalidateQueries({ queryKey: ["admin-courses"] });
  };

  return (
    <div style={{ maxWidth: 1000,maxHeight:100, margin: "60px auto" }}>
      <h2 className="admin">Admin Courses</h2>
      <Link to="/admin/courses/new" className="btn btn-primary" style={{ marginTop: 30 }}>
        + Add New Course
      </Link>
      <div style={{ display: "grid", gap: 30, marginTop:30, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {data?.items?.map((c) => (
          <div key={c.id} className="card" style={{ position: "relative" }}>
            <h3>{c.title}</h3>
            <p style={{ color: "var(--text-secondary)" }}>
              {c.category} · {c.level}
            </p>
            <p>{c.description?.slice(0, 100)}...</p>
            <div style={{ display: "flex", gap: 22, marginTop: 16 }}>
              <Link to={`/admin/courses/${c.id}`} className="btn btn-edit">
                Edit
              </Link>
              <button onClick={() => remove(c.id)} className="btn btn-delete">
                Delete
              </button>
            </div>
          </div>
        ))}
        {!data?.items?.length && <div className="empty">No courses found</div>}
      </div>
    </div>
  );
}
