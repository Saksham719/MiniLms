import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import { useState } from "react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Empty from "../ui/Empty";
import Spinner from "../ui/Spinner";

export default function CourseCatalog() {
  const [q,setQ]=useState(""); const [category,setCategory]=useState(""); const [level,setLevel]=useState("");
  const { data, isLoading } = useQuery({
    queryKey:["courses",q,category,level],
    queryFn: async ()=>{
      const r = await api.get("/courses", { params: { search:q || undefined, category:category || undefined, level: level || undefined }});
      return r.data;
    }
  });

  return (
    <Card>
      <div className="toolbar">
        <Input placeholder="Search courses…" value={q} onChange={e=>setQ(e.target.value)} />
        <Input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
        <Select value={level} onChange={e=>setLevel(e.target.value)}>
          <option value="">Level</option>
          <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
        </Select>
        <span className="spacer" />
        <Button variant="outline" onClick={()=>{setQ("");setCategory("");setLevel("")}}>Clear</Button>
      </div>

      {isLoading ? <div className="empty"><Spinner/> Loading...</div> :
        data?.items?.length ? (
          <div className="grid">
            {data.items.map(c=>(
              <div key={c.id} className="card" style={{padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <h3 style={{margin:"6px 0"}}>{c.title}</h3>
                  {c.isPublished ? <Badge tone="ok">Published</Badge> : <Badge tone="warn">Draft</Badge>}
                </div>
                <div style={{opacity:.8, marginBottom:10}}>
                  {c.category || "General"} · {c.level || "Level N/A"} · {c.durationMinutes || 0} mins
                </div>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                  <Link className="btn btn-primary btn-small" to={`/courses/${c.id}`}>View</Link>
                </div>
              </div>
            ))}
          </div>
        ) : <Empty>No courses match your filters.</Empty>
      }
    </Card>
  );
}
