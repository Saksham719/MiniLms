import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import Empty from "../ui/Empty";
import Spinner from "../ui/Spinner";
import { useState } from "react";

export default function AdminCourseList() {
  const qc = useQueryClient();
  const [q,setQ]=useState("");
  const { data, isLoading } = useQuery({
    queryKey:["admin-courses", q],
    queryFn: async ()=> (await api.get("/courses", { params: { search: q || undefined } })).data
  });

  const remove = async (id)=>{
    if (!confirm("Delete course?")) return;
    await api.delete(`/courses/${id}`);
    qc.invalidateQueries({ queryKey:["admin-courses"] });
  };

  return (
    <Card>
      <div className="toolbar">
        <Input placeholder="Search by title…" value={q} onChange={e=>setQ(e.target.value)} />
        <span className="spacer" />
        <Link to="/admin/courses/new" className="btn btn-primary btn-small">+ New Course</Link>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th><th>Meta</th><th>State</th><th style={{width:160}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="empty"><Spinner/> Loading…</td></tr>
            ) : data?.items?.length ? (
              data.items.map(c=>(
                <tr key={c.id}>
                  <td style={{fontWeight:600}}>{c.title}</td>
                  <td>{(c.category || "General")} · {(c.level || "N/A")} · {(c.durationMinutes || 0)} mins</td>
                  <td>{c.isPublished ? <Badge tone="ok">Published</Badge> : <Badge tone="warn">Draft</Badge>}</td>
                  <td style={{display:"flex",gap:8}}>
                    <Link className="btn btn-small" to={`/admin/courses/${c.id}`}>Edit</Link>
                    <Button className="btn-small" variant="danger" onClick={()=>remove(c.id)}>Delete</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="empty"><Empty>No courses found.</Empty></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
