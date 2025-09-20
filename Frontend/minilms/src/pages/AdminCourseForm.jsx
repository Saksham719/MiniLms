import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { toast } from "react-hot-toast";

export default function AdminCourseForm() {
  const { id } = useParams(); // If editing, id will be present
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        category,
        level,
        durationMinutes: parseInt(duration),
        isPublished,
      };

      if (id) {
        // Update existing course
        await api.put(`/courses/${id}`, payload);
        toast.success("Course updated successfully!");
      } else {
        // Create new course
        await api.post("/courses", payload);
        toast.success("Course created successfully!");
      }

      navigate("/admin/courses"); // Redirect back to admin course list
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 16 }}>
      <h2>{id ? "Edit Course" : "Add New Course"}</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 12 }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          placeholder="Level (Beginner / Intermediate / Advanced)"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
        />
        <input
          placeholder="Duration in minutes"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <label>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />{" "}
          Published
        </label>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : id ? "Update Course" : "Create Course"}
        </button>
      </form>
    </div>
  );
}
