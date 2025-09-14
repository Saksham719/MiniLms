import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import toast from "react-hot-toast";

export default function AdminCourseForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const edit = !!id; // if id exists, it's an edit form
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "",
    durationMinutes: 0,
    isPublished: false,
  });

  useEffect(() => {
    if (edit) {
      api.get(`/courses/${id}`).then((r) => setForm(r.data));
    }
  }, [edit, id]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (edit) {
      await api.put(`/courses/${id}`, form);
      toast.success("Course updated successfully");
    } else {
      await api.post("/courses", form);
      toast.success("Course created successfully");
    }
    nav("/admin/courses");
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>{edit ? "Edit" : "New"} Course</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
        <input
          placeholder="Course Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Category (e.g., Data, Programming)"
          value={form.category || ""}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Level (e.g., Beginner, Intermediate)"
          value={form.level || ""}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration in minutes"
          value={form.durationMinutes}
          onChange={(e) => setForm({ ...form, durationMinutes: +e.target.value })}
        />
        <label>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />{" "}
          Published
        </label>
        <textarea
          rows={4}
          placeholder="Course Description"
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={() => nav("/admin/courses")} className="btn btn-small btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {edit ? "Save" : "Create"}
          </button>
          
        </div>
        
      </form>
    </div>
  );
}
