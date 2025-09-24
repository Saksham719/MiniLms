// src/pages/CourseDetail.jsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useParams, Link } from "react-router-dom";
import { enrollCourse } from "../api/enrollments";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => (await api.get(`/courses/${id}`)).data,
  });

  const onEnroll = async () => {
    try {
      await enrollCourse(id);
      toast.success("Enrolled successfully");
    } catch (e) {
      toast.error(e?.response?.data || "Enroll failed");
    }
  };

  if (!data) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>{data.title}</h2>
      <div style={{ opacity: 0.8, marginBottom: 20 }}>
        {data.category} · {data.level} · {data.durationMinutes} mins
      </div>
      <p style={{ marginBottom: 20 }}>{data.description || "No description"}</p>

      {user?.role === "Student" && (
        <button onClick={onEnroll} className="btn btn-primary">Enroll</button>
      )}

      <Link to="/catalog" className="btn btn-back" style={{ marginLeft: 12 }}>
        ← Back
      </Link>
    </div>
  );
}
