import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAdminEnrollments, adminUpdateEnrollment, adminDeleteEnrollment } from "../api/enrollments";
import toast from "react-hot-toast";

export default function AdminCourseEnrollments() {
  const { id } = useParams(); // courseId
  const courseId = Number(id);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  async function load() {
    const res = await getAdminEnrollments({ courseId, page, pageSize });
    setRows(res.data.data);
    setTotal(res.data.totalCount);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, courseId]);

  const onSave = async (enrollId, val) => {
    try {
      await adminUpdateEnrollment(enrollId, Number(val));
      toast.success("Progress updated");
      load();
    } catch {
      toast.error("Update failed");
    }
  };

  const onDelete = async (enrollId) => {
    if (!confirm("Delete this enrollment?")) return;
    try {
      await adminDeleteEnrollment(enrollId);
      toast.success("Enrollment deleted");
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Enrollments for Course #{courseId}</h2>
        <Link to="/admin/courses" className="btn btn-back">← Back to Admin</Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th>Progress</th>
            <th>Enrolled</th>
            <th>Last Accessed</th>
            <th style={{ width: 180 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(e => (
            <tr key={e.id}>
              <td>{e.student.fullName}</td>
              <td>{e.student.email}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={e.progress}
                  onBlur={(ev) => onSave(e.id, ev.target.value)}
                  style={{ width: 70 }}
                /> %
              </td>
              <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
              <td>{e.lastAccessedAt ? new Date(e.lastAccessedAt).toLocaleString() : "-"}</td>
              <td>
                <button className="btn btn-edit" onClick={(ev)=>onSave(e.id, ev.target.closest('tr').querySelector('input').value)} style={{ marginRight: 8 }}>
                  Save
                </button>
                <button className="btn btn-delete" onClick={() => onDelete(e.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan="6" style={{ opacity: 0.7, padding: 12 }}>No enrollments yet.</td></tr>
          )}
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
