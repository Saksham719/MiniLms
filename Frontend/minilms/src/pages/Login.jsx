import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [busy,setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { await login(email, password); toast.success("Welcome back"); nav("/"); }
    catch { toast.error("Invalid credentials"); }
    finally { setBusy(false); }
  };

  return (
    <div style={{maxWidth:420, margin:"40px auto"}}>
      <Card>
        <h2 style={{marginTop:0}}>Login</h2>
        <form onSubmit={submit} style={{display:"grid",gap:10}}>
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
            <Button type="submit" variant="primary" disabled={busy}>{busy ? "Signing in…" : "Login"}</Button>
          </div>
        </form>
        <p style={{marginTop:12,opacity:.8}}>Admin: admin@demo.com / Admin@123</p>
        <p style={{opacity:.8}}>Student: student@demo.com / Student@123</p>
      </Card>
    </div>
  );
}
