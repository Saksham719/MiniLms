// src/pages/AdminCourseList.jsx
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PAGE_SIZE = 8;

export default function AdminCourseList() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const key = useMemo(
    () => ["admin-courses", { page, search: debouncedSearch, category, level }],
    [page, debouncedSearch, category, level]
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const res = await api.get("/courses", {
        params: {
          search: debouncedSearch || undefined,
          category: category || undefined,
          level: level || undefined,
          page,
          pageSize: PAGE_SIZE,
        },
      });
      return res.data; // { total, page, pageSize, items }
    },
    keepPreviousData: true,
  });

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const remove = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/courses/${id}`);
    toast.success("Course deleted");
    if (items.length === 1 && page > 1) setPage((p) => p - 1);
    qc.invalidateQueries({ queryKey: ["admin-courses"] });
  };

  const reset = () => { setSearch(""); setCategory(""); setLevel(""); setPage(1); };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Courses</h2>
          <p className="page-sub">Manage your catalog, enrollments, and visibility</p>
        </div>
        <Link to="/admin/courses/new" className="btn btn-primary">+ Add New Course</Link>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search title…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: "1 1 280px", minWidth: 240 }}
        />
        <select
          className="select-light"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">All categories</option>
          <option value="Programming">Programming</option>
          <option value="Web Development">Web Development</option>
        </select>
        <select
          className="select-light"
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1); }}
        >
          <option value="">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>

      {isLoading && (
        <div className="grid">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => <div key={i} className="skeleton" />)}
        </div>
      )}

      {isError && <div className="empty">Couldn’t load courses. Try again.</div>}

      {!isLoading && !isError && (
        <>
          {/* Courses grid */}
          <div className="grid">
            {items.map((course) => (
              <div key={course.id} className="card">
                <div className="card-head">
                  <h3 className="card-title" title={course.title}>{course.title}</h3>
                  <span className={`badge ${course.isPublished ? "ok" : ""}`}>
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="card-meta">
                  {course.category || "—"} • {course.level || "—"}
                </div>

                <div className="card-desc">
                  {(course.description || "No description").slice(0, 140)}
                  {course.description && course.description.length > 140 ? "…" : ""}
                </div>

                <div className="card-meta">
                  {course.durationMinutes ?? 0} mins • Created {new Date(course.createdAt).toLocaleDateString()}
                </div>

                <div className="card-actions">
                  <Link to={`/admin/courses/${course.id}`} className="btn btn-ghost">Edit</Link>
                  <Link to={`/admin/courses/${course.id}/enrollments`} className="btn btn-primary">View Enrollments</Link>
                  <Link to={`/admin/courses/${course.id}/materials`} className="btn btn-ghost">Materials</Link>
                  <button onClick={() => remove(course.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && <div className="empty">No courses found. Adjust filters.</div>}

          <div className="pager">
            <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span>Page {page} of {totalPages} • {total} total</span>
            <button className="btn btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </>
      )}
    </div>
  );
}
