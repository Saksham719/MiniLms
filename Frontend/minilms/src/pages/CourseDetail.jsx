import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useParams } from "react-router-dom";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Empty from "../ui/Empty";

export default function CourseDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey:["course",id],
    queryFn: async ()=> (await api.get(`/courses/${id}`)).data
  });

  if (isLoading) return <Card><div className="empty">Loading…</div></Card>;
  if (!data) return <Empty>Course not found.</Empty>;

  return (
    <div className="card">
      <h2 style={{marginTop:0}}>{data.title}</h2>
      <div style={{display:"flex",gap:10,alignItems:"center",opacity:.9, marginBottom:10}}>
        <Badge tone="info">{data.category || "General"}</Badge>
        <Badge tone="warn">{data.level || "Level N/A"}</Badge>
        <Badge tone="ok">{data.durationMinutes || 0} mins</Badge>
        {data.isPublished ? <Badge tone="ok">Published</Badge> : <Badge tone="warn">Draft</Badge>}
      </div>
      <p style={{lineHeight:1.6}}>{data.description || "No description provided."}</p>
    </div>
  );
}
