import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false);

  const submit = async (e)=>{
    e.preventDefault(); setBusy(true);
    try { await register(fullName,email,password); toast.success("Registered"); nav("/login"); }
    catch(err){ toast.error(err?.response?.data || "Failed"); }
    finally{ setBusy(false); }
  };

  return (
    <div style={{maxWidth:460, margin:"40px auto"}}>
      <Card>
        <h2 style={{marginTop:0}}>Create account</h2>
        <form onSubmit={submit} style={{display:"grid",gap:10}}>
          <Input placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
            <Button variant="outline" type="button" onClick={()=>nav(-1)}>Cancel</Button>
            <Button variant="primary" disabled={busy}>{busy ? "Creating…" : "Register"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
