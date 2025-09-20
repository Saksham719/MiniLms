import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminCourseList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showEnrollments, setShowEnrollments] = useState(false);

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => (await api.get("/courses")).data.items,
  });

  // Fetch enrollments for a selected course
  const { data: enrollments, refetch } = useQuery({
    queryKey: ["enrollments", selectedCourseId],
    queryFn: async () => {
      if (!selectedCourseId) return [];
      const r = await api.get(`/enrollments/course/${selectedCourseId}`);
      return r.data;
    },
    enabled: false, // manual fetch
  });

  const handleViewEnrollments = (courseId) => {
    setSelectedCourseId(courseId);
    setShowEnrollments(true);
    refetch(); // fetch enrollments for this course
  };

  if (isLoading) return <div>Loading courses…</div>;

  return (
    <div style={{ maxWidth: 900, margin: "20px auto" }}>
      {/* Header with Add New Course */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Admin: Courses</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/courses/new")}
        >
          Add New Course +
        </button>
      </div>

      {/* Course list */}
      <div style={{ display: "grid", gap: 10 }}>
        {courses.map((c) => (
          <div key={c.id} className="card">
            <h3>{c.title}</h3>
            <p style={{ color: "var(--text-dim)" }}>{c.category} · {c.level}</p>

            {/* View Enrollments button per course */}
            {user?.role === "Admin" && (
              <button
                className="btn btn-primary"
                onClick={() => handleViewEnrollments(c.id)}
                style={{ marginTop: 8 }}
              >
                View Enrollments
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Enrollments Modal */}
      {showEnrollments && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowEnrollments(false)}
        >
          <div
            className="card"
            style={{ width: 500, maxHeight: "70%", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Enrolled Students</h3>
            {enrollments?.length > 0 ? (
              <ul>
                {enrollments.map((e) => (
                  <li key={e.id}>
                    {e.userName} — Progress: {e.progress}% — Last Accessed:{" "}
                    {new Date(e.lastAccessed).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No students enrolled yet.</div>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => setShowEnrollments(false)}
              style={{ marginTop: 12 }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
