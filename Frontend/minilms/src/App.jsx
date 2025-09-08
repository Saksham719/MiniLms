import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import AdminCourseList from "./pages/AdminCourseList";
import AdminCourseForm from "./pages/AdminCourseForm";

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 16px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>MiniLms</span>
        </div>
        <nav style={{ display: "flex", gap: 20 }}>
          <Link to="/" className="btn btn-ghost">Catalog</Link>
          {user?.role === "Admin" && <Link to="/admin/courses" className="btn btn-ghost">Admin</Link>}
        </nav>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 12 }}>{user.fullName} ({user.role})</span>
              <button onClick={logout} className="btn btn-ghost">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" style={{ marginRight: 12 }}>Login</Link>
              <Link to="/register" className="btn btn-ghost">Register</Link>
            </>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute role="Admin">
              <AdminCourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/new"
          element={
            <ProtectedRoute role="Admin">
              <AdminCourseForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:id"
          element={
            <ProtectedRoute role="Admin">
              <AdminCourseForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
