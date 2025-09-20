import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export default function StudentDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["myEnrollments"],
    queryFn: async () => (await api.get("/enrollments/my")).data,
  });

  if (isLoading) return <div>Loading…</div>;
  if (!data || data.length === 0) return <div>No enrollments yet.</div>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>My Courses</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.map((en) => (
          <li
            key={en.id}
            style={{
              padding: 16,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              marginBottom: 12,
              background: "var(--surface)"
            }}
          >
            <h3>{en.course.title}</h3>
            <p>{en.course.description}</p>
            <div style={{ marginTop: 8 }}>
              Progress: {en.progress}%
              <div
                style={{
                  height: 8,
                  background: "#2a3a56",
                  borderRadius: 4,
                  marginTop: 4
                }}
              >
                <div
                  style={{
                    width: `${en.progress}%`,
                    background: "var(--primary)",
                    height: "100%",
                    borderRadius: 4
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
