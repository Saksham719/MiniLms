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
      return res.data; // { total, items, page, pageSize }
    },
    keepPreviousData: true,
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const remove = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/courses/${id}`);
    toast.success("Course deleted");
    if ((data?.items?.length ?? 0) === 1 && page > 1) setPage((p) => p - 1);
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
        <Link to="/admin/courses/new" className="btn btn-primary icon-gap">
          <span>＋</span> <span>Add New Course</span>
        </Link>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search title…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className="select-light"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
        >
          <option value="">All categories</option>
          <option>Programming</option>
          <option>Web Development</option>
        </select>
        <select
          className="select-light"
          value={level}
          onChange={(e) => { setLevel(e.target.value); setPage(1); }}
        >
          <option value="">All levels</option>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <button className="btn-reset" onClick={reset}>Reset</button>
      </div>

      {isLoading && (
        <div className="grid">{Array.from({ length: PAGE_SIZE }).map((_, i) => <div key={i} className="skeleton" />)}</div>
      )}

      {isError && <div className="empty">Couldn’t load courses. Try again.</div>}

      {!isLoading && !isError && (
        <>
          <div className="grid">
            {(data?.items ?? []).map((c) => (
              <div key={c.id} className="card">
                <div className="card-head">
                  <h3 className="card-title" title={c.title}>{c.title}</h3>
                  <span className={`badge ${c.isPublished ? "ok" : ""}`}>
                    {c.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="card-meta">{c.category || "—"} • {c.level || "—"}</div>
                <div className="card-desc">
                  {(c.description || "No description").slice(0, 140)}
                  {c.description && c.description.length > 140 ? "…" : ""}
                </div>

                <div className="card-meta">
                  {c.durationMinutes ?? 0} mins • Created {new Date(c.createdAt).toLocaleDateString()}
                </div>

                <div className="card-actions">
                  <Link to={`/admin/courses/${c.id}`} className="btn btn-ghost">Edit</Link>
                  <Link to={`/admin/courses/${c.id}/enrollments`} className="btn btn-primary">View Enrollments</Link>
                  <button onClick={() => remove(c.id)} className="btn btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>

          {(data?.items?.length ?? 0) === 0 && <div className="empty">No courses found. Adjust filters.</div>}

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
