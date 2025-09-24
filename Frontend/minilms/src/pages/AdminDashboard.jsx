// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getAdminEnrollments } from "../api/enrollments";

export default function AdminDashboard() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");

  async function load() {
    const res = await getAdminEnrollments({ search, page, pageSize });
    setData(res.data.data);
    setTotal(res.data.totalCount);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <h2>All Enrollments</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search by student or course"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260, marginRight: 8 }}
        />
        <button onClick={() => { setPage(1); load(); }}>Search</button>
      </div>

      <table className="table">
        <thead>
          <tr><th>Student</th><th>Course</th><th>Progress</th><th>Enrolled</th><th>Last Access</th></tr>
        </thead>
        <tbody>
          {data.map(e => (
            <tr key={e.id}>
              <td>{e.student.fullName} ({e.student.email})</td>
              <td>{e.course.title}</td>
              <td>{e.progress}%</td>
              <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
              <td>{e.lastAccessedAt ? new Date(e.lastAccessedAt).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        {Array.from({ length: Math.ceil(total / pageSize) }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} disabled={page === i + 1} style={{ marginRight: 6 }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
