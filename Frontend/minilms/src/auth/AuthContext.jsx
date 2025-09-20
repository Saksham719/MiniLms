import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";
import toast from "react-hot-toast";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = async (email, password) => {
    try {
      const response = await api.post("auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      toast.success(`Welcome ${response.data.user.fullName}`);
      return response.data.user;
    } catch (err) {
      const msg = err?.response?.data || "Login failed";
      toast.error(msg);
      throw err;
    }
  };

  const register = async (fullName, email, password, role = "Student") => {
    try {
      await api.post("auth/register", { fullName, email, password, role });
      toast.success("Registration successful. Please login.");
    } catch (err) {
      const msg = err?.response?.data || "Registration failed";
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully");
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
