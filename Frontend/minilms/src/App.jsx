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
import AdminCourseEnrollments from "./pages/AdminCourseEnrollments";  

export default function App() {
  const { user, logout } = useAuth();

  return (
   <div style={{ maxWidth: 1400, margin: "0px auto", padding: "0 0px" }}>
  {/* =======================
        HEADER / NAVBAR
  ======================= */}
  <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem",
        height: 60,
        backgroundColor: "var(--header-bg)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        marginBottom: 24,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/lms-logo.png"
          alt="LMS Logo"
          style={{ height: 40, width: 40, objectFit: "contain" }}
        />
        <span style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>
          MiniLms
        </span>
      </div>

      {/* Navigation Links */}
      <nav
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
        }}
      >
        {/* Show Catalog link only if user is logged in */}
        {user && <Link to="/catalog" className="">Catalog</Link>}

        {/* Show Admin link only for admin */}
        {user?.role === "Admin" && (
          <Link to="/admin/courses" className="">Admin</Link>
        )}

        {/* Show Login/Register if not logged in */}
        {!user && (
          <>
            <Link to="/" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}

        
      </nav>
    </header>

 

  {/* =======================
        USER INFO SECTION (Logged in)
  ======================= */}
  {user && (
    <div
      style={{
        display: "flex",
        padding: "0 4rem",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem",
      }}
    >
      <span>
        Welcome, <strong>{user.fullName}</strong> ({user.role})
      </span>
      <button to="/" onClick={logout} className="btn btn-logout">
        Logout
      </button>
    </div>
  )}

  {/* =======================
        ROUTES
  ======================= */}
  <Routes>
    <Route path="/" element={<Login />} />
  <Route
    path="/catalog"
    element={
      <ProtectedRoute>
        <CourseCatalog />
      </ProtectedRoute>
    }
  />
  <Route path="/admin/courses/:id/enrollments" element={<AdminCourseEnrollments />} />
  <Route path="/courses/:id" element={<CourseDetail />} />
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
