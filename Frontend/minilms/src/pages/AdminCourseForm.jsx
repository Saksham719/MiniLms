// src/pages/AdminCourseForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import toast from "react-hot-toast";

const empty = {
  title: "",
  description: "",
  category: "",
  level: "",
  durationMinutes: 0,
  isPublished: false,
};

export default function AdminCourseForm() {
  const { id } = useParams();           // if present => edit mode
  const nav = useNavigate();
  const isEdit = Boolean(id);

  const [values, setValues] = useState(empty);
  const [loading, setLoading] = useState(isEdit); // load only in edit

  // Load existing course for edit
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isEdit) return;
      try {
        setLoading(true);
        const { data } = await api.get(`/courses/${id}`);
        if (!cancelled) {
          setValues({
            title: data.title ?? "",
            description: data.description ?? "",
            category: data.category ?? "",
            level: data.level ?? "",
            durationMinutes: data.durationMinutes ?? 0,
            isPublished: data.isPublished ?? false,
          });
        }
      } catch (e) {
        toast.error("Failed to load course");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id, isEdit]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === "checkbox" ? checked : (name === "durationMinutes" ? Number(value) : value),
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // This is the object we send — NOT a stray "form" variable.
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category.trim(),
      level: values.level.trim(),
      durationMinutes: Number(values.durationMinutes) || 0,
      isPublished: Boolean(values.isPublished),
    };

    try {
      if (isEdit) {
        await api.put(`/courses/${id}`, payload);
        toast.success("Course updated");
      } else {
        await api.post(`/courses`, payload);
        toast.success("Course created");
      }
      nav("/admin/courses", { replace: true });
    } catch (err) {
      const msg = err?.response?.data || "Save failed";
      toast.error(String(msg));
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">{isEdit ? "Edit Course" : "Add New Course"}</h2>
          <p className="page-sub">{isEdit ? `Course #${id}` : "Create a new course for the catalog"}</p>
        </div>
        <Link to="/admin/courses" className="">← Back</Link>
      </div>

      <form onSubmit={onSubmit} className="card" style={{ maxWidth: 860 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <label>
            <div className="page-sub" style={{ marginBottom: 6 }}>Title</div>
            <input
              className="input"
              name="title"
              value={values.title}
              onChange={onChange}
              placeholder="e.g., Intro to Programming"
              required
            />
          </label>

          <label>
            <div className="page-sub" style={{ marginBottom: 6 }}>Description</div>
            <textarea
              className="input"
              name="description"
              value={values.description}
              onChange={onChange}
              rows={5}
              placeholder="What will students learn?"
              style={{ paddingTop: 10, paddingBottom: 10 }}
            />
          </label>

          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
            <label>
              <div className="page-sub" style={{ marginBottom: 6 }}>Category</div>
              <select
                className="select-light"
                name="category"
                value={values.category}
                onChange={onChange}
              >
                <option value="">Select category</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
              </select>
            </label>

            <label>
              <div className="page-sub" style={{ marginBottom: 6 }}>Level</div>
              <select
                className="select-light"
                name="level"
                value={values.level}
                onChange={onChange}
              >
                <option value="">Select level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </label>
          </div>

          <label>
            <div className="page-sub" style={{ marginBottom: 6 }}>Duration (minutes)</div>
            <input
              className="input"
              type="number"
              min="0"
              name="durationMinutes"
              value={values.durationMinutes}
              onChange={onChange}
              placeholder="e.g., 120"
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input
              type="checkbox"
              name="isPublished"
              checked={values.isPublished}
              onChange={onChange}
            />
            <span>Published</span>
          </label>

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Update Course" : "Create Course"}
            </button>
            <Link to="/admin/courses" className="btn btn-ghost">Cancel</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
