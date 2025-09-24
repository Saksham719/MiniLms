import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listMaterials, addUrlMaterial, uploadFileMaterial, deleteMaterial } from "../api/materials";
import toast from "react-hot-toast";

export default function AdminCourseMaterials() {
  const { id } = useParams();
  const courseId = Number(id);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // add-url form
  const [titleUrl, setTitleUrl] = useState("");
  const [url, setUrl] = useState("");

  // add-file form
  const [titleFile, setTitleFile] = useState("");
  const [file, setFile] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const { data } = await listMaterials(courseId);
      setItems(data);
    } catch {
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [courseId]);

  const onAddUrl = async (e) => {
    e.preventDefault();
    if (!titleUrl.trim() || !url.trim()) return;
    try {
      await addUrlMaterial(courseId, { title: titleUrl.trim(), url: url.trim() });
      setTitleUrl(""); setUrl("");
      toast.success("URL added");
      load();
    } catch { toast.error("Failed to add URL"); }
  };

  const onAddFile = async (e) => {
    e.preventDefault();
    if (!titleFile.trim() || !file) return;
    try {
      await uploadFileMaterial(courseId, { title: titleFile.trim(), file });
      setTitleFile(""); setFile(null);
      e.target.reset?.();
      toast.success("File uploaded");
      load();
    } catch { toast.error("Upload failed"); }
  };

  const onDelete = async (mid) => {
    if (!confirm("Delete this material?")) return;
    try {
      await deleteMaterial(mid);
      toast.success("Deleted");
      setItems(items => items.filter(i => i.id !== mid));
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Materials</h2>
          <p className="page-sub">Course #{courseId}</p>
        </div>
        <Link to={`/admin/courses`} className="btn btn-ghost">← Back to Course</Link>
      </div>

      {/* Add URL */}
      <form onSubmit={onAddUrl} className="card" style={{ marginBottom: 16, maxWidth: 900 }}>
        <div className="page-sub" style={{ marginBottom: 8 }}>Add Material (URL)</div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 2fr auto" }}>
          <input className="input" placeholder="Title" value={titleUrl} onChange={(e)=>setTitleUrl(e.target.value)} />
          <input className="input" placeholder="https://..." value={url} onChange={(e)=>setUrl(e.target.value)} />
          <button className="btn btn-primary" type="submit">Add URL</button>
        </div>
      </form>

      {/* Upload File */}
      <form onSubmit={onAddFile} className="card" style={{ marginBottom: 16, maxWidth: 900 }}>
        <div className="page-sub" style={{ marginBottom: 8 }}>Upload Material (File)</div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 2fr auto" }}>
          <input className="input" placeholder="Title" value={titleFile} onChange={(e)=>setTitleFile(e.target.value)} />
          <input className="input" type="file" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
          <button className="btn btn-primary" type="submit">Upload</button>
        </div>
      </form>

      {/* List */}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{width:'35%'}}>Title</th>
              <th style={{width:'25%'}}>Type</th>
              <th>Link / Path</th>
              <th style={{width:'170px'}}>Uploaded</th>
              <th style={{width:'110px'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="5"><div className="empty">Loading materials…</div></td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan="5"><div className="empty">No materials yet.</div></td></tr>
            )}
            {!loading && items.map(m => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td className="muted">{m.type.toUpperCase()}</td>
                <td>
                  {m.type === "url" ? (
                    <a href={m.location} target="_blank" rel="noreferrer">{m.location}</a>
                  ) : (
                    <a href={m.location} target="_blank" rel="noreferrer">Download</a>
                  )}
                </td>
                <td className="muted">{new Date(m.uploadedAt).toLocaleString()}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={()=>onDelete(m.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
