// src/pages/StudentDashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getStudentEnrollments, updateProgress } from "../api/enrollments";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [total, setTotal] = useState(0);

  async function load() {
    const res = await getStudentEnrollments(user.id, page, pageSize);
    setRows(res.data.items);
    setTotal(res.data.total);
  }

  useEffect(() => { if (user) load(); /* eslint-disable-next-line */ }, [page, user]);

  const onUpdate = async (id, p) => {
    try {
      await updateProgress(id, Number(p));
      toast.success("Progress updated");
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2>Your Courses</h2>
      <table className="table">
        <thead>
          <tr><th>Course</th><th>Progress</th><th>Enrolled</th><th>Update</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.CourseTitle}</td>
              <td>{r.Progress ?? r.progress}%</td>
              <td>{new Date(r.EnrolledAt ?? r.enrolledAt).toLocaleDateString()}</td>
              <td>
                <input
                  type="number"
                  min="0" max="100"
                  defaultValue={r.Progress ?? r.progress}
                  onBlur={(e) => onUpdate(r.Id ?? r.id, e.target.value)}
                  style={{ width: 70 }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12 }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} disabled={page === i + 1} style={{ marginRight: 6 }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
