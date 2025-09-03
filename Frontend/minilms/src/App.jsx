import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Button from "./ui/Button";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import AdminCourseList from "./pages/AdminCourseList";
import AdminCourseForm from "./pages/AdminCourseForm";

export default function App(){
  const { user, logout } = useAuth();
  return (
    <div className="container">
      <header className="appbar">
        <div className="brand">
          <span className="badge-dot" />
          <h1>MiniLms</h1>
        </div>
        <nav style={{display:"flex",gap:10,alignItems:"center"}}>
          <Link className="btn btn-ghost btn-small" to="/">Catalog</Link>
          {user?.role==="Admin" && <Link className="btn btn-ghost btn-small" to="/admin/courses">Admin</Link>}
          <span className="spacer" />
          {user ? (
            <>
              <span style={{opacity:.8, marginRight:8}}>{user.fullName} ({user.role})</span>
              <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-small" to="/login">Login</Link>
              <Link className="btn btn-primary btn-small" to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<CourseCatalog/>} />
        <Route path="/courses/:id" element={<CourseDetail/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        <Route path="/admin/courses" element={
          <ProtectedRoute role="Admin"><AdminCourseList/></ProtectedRoute>
        }/>
        <Route path="/admin/courses/new" element={
          <ProtectedRoute role="Admin"><AdminCourseForm/></ProtectedRoute>
        }/>
        <Route path="/admin/courses/:id" element={
          <ProtectedRoute role="Admin"><AdminCourseForm/></ProtectedRoute>
        }/>
      </Routes>
    </div>
  );
}
