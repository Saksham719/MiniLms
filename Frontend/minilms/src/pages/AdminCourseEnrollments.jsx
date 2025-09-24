import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAdminEnrollments, adminUpdateEnrollment, adminDeleteEnrollment } from "../api/enrollments";
import toast from "react-hot-toast";

export default function AdminCourseEnrollments() {
  const { id } = useParams();
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
    } catch { toast.error("Update failed"); }
  };

  const onDelete = async (enrollId) => {
    if (!confirm("Delete this enrollment?")) return;
    try {
      await adminDeleteEnrollment(enrollId);
      toast.success("Enrollment deleted");
      // stay on same page; if last item removed, refetch will handle empty state
      load();
    } catch { toast.error("Delete failed"); }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Enrollments</h2>
          <p  className="page-sub">Course #{courseId}</p>
        </div>
        <Link to="/admin/courses" className="">← Back to Admin</Link>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{width: '28%'}}>Student</th>
              <th style={{width: '28%'}}>Email</th>
              <th style={{width: '14%'}}>Progress</th>
              <th style={{width: '15%'}}>Enrolled</th>
              <th style={{width: '15%'}}>Last Accessed</th>
              <th style={{width: '150px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(e => (
              <tr key={e.id}>
                <td>{e.student.fullName}</td>
                <td className="muted">{e.student.email}</td>
                <td>
                  <input
                    type="number"
                    min="0" max="100"
                    defaultValue={e.progress}
                    onBlur={(ev) => onSave(e.id, ev.target.value)}
                    className="input"
                    style={{ width: 80, height: 34 }}
                  /> %
                </td>
                <td className="muted">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                <td className="muted">{e.lastAccessedAt ? new Date(e.lastAccessedAt).toLocaleString() : "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-success btn-sm" onClick={(ev)=>onSave(e.id, ev.currentTarget.closest('tr').querySelector('input').value)}>Save</button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(e.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan="6">
                  <div className="empty">No enrollments yet for this course.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pager">
        <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
        <span>Page {page} of {totalPages} • {total} total</span>
        <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
      </div>
    </div>
  );
}
