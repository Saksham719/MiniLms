import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export default function AdminCourseForm() {
  const { id } = useParams(); const nav = useNavigate();
  const edit = !!id;
  const [busy,setBusy]=useState(false);
  const [form,setForm] = useState({ title:"", description:"", category:"", level:"", durationMinutes:0, isPublished:false });

  useEffect(()=>{
    if (edit) api.get(`/courses/${id}`).then(r=>setForm(r.data));
  },[edit,id]);

  const submit = async (e)=>{
    e.preventDefault(); setBusy(true);
    try {
      if (!form.title.trim()) { toast.error("Title is required"); setBusy(false); return; }
      if (form.durationMinutes < 0) { toast.error("Duration must be >= 0"); setBusy(false); return; }
      if (edit) await api.put(`/courses/${id}`, form);
      else await api.post(`/courses`, form);
      toast.success(edit ? "Saved" : "Created");
      nav("/admin/courses");
    } finally { setBusy(false); }
  };

  return (
    <Card>
      <h2 style={{marginTop:0}}>{edit ? "Edit" : "New"} Course</h2>
      <form onSubmit={submit} style={{display:"grid",gap:12, gridTemplateColumns:"1fr 1fr"}}>
        <label style={{gridColumn:"1 / -1"}}>
          <div>Title *</div>
          <Input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        </label>
        <label>
          <div>Category</div>
          <Input value={form.category||""} onChange={e=>setForm({...form,category:e.target.value})}/>
        </label>
        <label>
          <div>Level</div>
          <Select value={form.level||""} onChange={e=>setForm({...form,level:e.target.value})}>
            <option value="">Select level</option>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </Select>
        </label>
        <label>
          <div>Duration (mins)</div>
          <Input type="number" value={form.durationMinutes} onChange={e=>setForm({...form,durationMinutes:+e.target.value})}/>
        </label>
        <label>
          <div>Published</div>
          <input type="checkbox" checked={form.isPublished} onChange={e=>setForm({...form,isPublished:e.target.checked})}/>
        </label>
        <label style={{gridColumn:"1 / -1"}}>
          <div>Description</div>
          <textarea className="input" rows={4} value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/>
        </label>
        <div style={{gridColumn:"1 / -1", display:'flex', gap:10, justifyContent:'flex-end'}}>
          <Button type="button" variant="outline" onClick={()=>nav(-1)}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={busy}>{busy ? "Saving…" : edit ? "Save" : "Create"}</Button>
        </div>
      </form>
    </Card>
  );
}
