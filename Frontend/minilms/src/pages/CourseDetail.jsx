import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../api/client"; // Axios instance
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";

export default function CourseDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Redirect if user is not logged in
  if (!user) {
    nav("/");
    return null;
  }

  // Fetch course details
  const { data, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => (await api.get(`/courses/${id}`)).data,
  });

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");



      setIsEnrolled(true);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data || err.message || "Error enrolling in course");
    },
    onSuccess: () => toast.success("Successfully enrolled in the course!"),
  });

  if (isLoading) return <div>Loading course details…</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h2>{data.title}</h2>
      <div style={{ opacity: 0.8, marginBottom: 20 }}>
        {data.category} · {data.level} · {data.durationMinutes} mins
      </div>
      <p>{data.description || "No description available."}</p>

      {/* Enroll button */}
      {!isEnrolled ? (
        <button
          onClick={() => enrollMutation.mutate()}
          className="btn btn-primary"
          style={{ marginTop: 30 }}
        >
          Enroll Now
        </button>
      ) : (
        <div style={{ marginTop: 30, color: "green" }}>
          You are enrolled in this course!
        </div>
      )}

      {/* Back button to Catalog */}
      <button
        onClick={() => nav("/catalog")}
        className="btn btn-ghost"
        style={{ marginTop: 20 }}
      >
        ← Back to Catalog
      </button>
    </div>
  );
}
