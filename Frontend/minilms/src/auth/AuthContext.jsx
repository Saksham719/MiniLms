import { createContext, useContext, useState } from "react";
import { api } from "../api/client";
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user"); return u ? JSON.parse(u) : null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const register = async (fullName, email, password) => {
    await api.post("/auth/register", { fullName, email, password, role:"Student" });
  };
  const logout = () => { localStorage.clear(); setUser(null); };

  return <AuthCtx.Provider value={{ user, login, register, logout }}>{children}</AuthCtx.Provider>;
}
