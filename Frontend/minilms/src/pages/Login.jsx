import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome");
      nav("/");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "40px auto" }}>
      <h2>Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
      <p style={{ marginTop: 10, opacity: 0.8 }}>Admin: admin@demo.com / Admin@123</p>
      <p style={{ opacity: 0.8 }}>Student: student@demo.com / Student@123</p>
    </div>
  );
}
