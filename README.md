# 📘 MiniLms — Weeks 2–4 Project

A minimal Learning Management System (LMS) built with ASP.NET Core 8 (Backend) and React + Vite (Frontend).
It demonstrates authentication, role-based access, course catalog, enrollments, materials, and admin management.

# 🛠 Tech Stack

Backend: ASP.NET Core 8, Entity Framework Core, SQLite, JWT Auth, CORS
Frontend: Vite, React, React Router, React Query, Axios

# 🚀 Setup & Run
    Backend (API)
    cd backend/MiniLms.Api
    dotnet restore
    dotnet ef database update   # applies latest migrations
    dotnet run


# API base URL (dev): http://localhost:5137 (update if your port differs)



Frontend (Web)
cd frontend/minilms
npm install
npm run dev


# UI base URL (dev): http://localhost:5173

If your API port changed, set API_BASE in your axios client accordingly (e.g., http://localhost:5237/api).

# 👥 Default Accounts (seed)

Admin → admin@mini.com / Admin@123
Student → student@mini.com / Student@123

# 🔐 Login / Landing

Navigate to / → Login page.
New registrations default to Student role.
Post-login:
Admin → /admin/courses
Student → /catalog

# 📖 Week 2 — Core Features

Role-based authentication (JWT)
Student Catalog (browse course list & details)
Admin course management (create, edit, delete, list)
Basic documentation and setup guide

# 📚 Week 3 — Enrollments
What’s implemented

# Student
Enroll in a course (duplicate-safe)
Student Dashboard: paginated enrollments with progress (0–100%) and last accessed timestamp

# Admin
Admin Courses page with search / category / level filters and pagination
Per-course View Enrollments with Edit progress and Delete actions

# API & Infra

Endpoints secured via JWT + CORS configured
EF Core migrations enabled
README updated with flows and endpoints

# Student flow

Login → Catalog → open a course → Enroll → Dashboard shows enrollments (update progress).

# Admin flow

Login → lands on /admin/courses → filter/search → View Enrollments for a course → edit or delete enrollments.

# 📦 Week 4 — Course Materials

Enable admins to attach materials (URL or uploaded file) to a course; students can view/download them on the course page.

# What’s included

# Backend

# Model:
CourseMaterial { Id, CourseId, Title, Type(url|file), Location, UploadedAt }

# Endpoints:

GET /api/courses/{id}/materials
POST /api/courses/{id}/materials/url (Admin)
POST /api/courses/{id}/materials/file (Admin, multipart)
DELETE /api/materials/{id} (Admin)
Static files are served from wwwroot/uploads/... (via app.UseStaticFiles())

3 Frontend

Admin → Course → Materials: add URL, upload file, list & delete materials
Student → Course Detail: Materials list with links:
URL → opens in new tab
File → downloads/opens from /uploads/...
Loaders, empty states, and toasts for good UX

# Migration (if not already applied)
cd backend/MiniLms.Api
dotnet ef migrations add Week4_Materials
dotnet ef database update

# Quick test

Login as Admin → /admin/courses → open a course → Materials
Add URL (title + https://…) → appears in list
Upload File (title + file) → appears with “Download”
Login as Student → open the same course → Materials visible
URL opens, file downloads
Delete a material as Admin → confirm it disappears from both pages

# 🔗 API Summary
# Auth

POST /api/auth/login
POST /api/auth/register

# Courses

GET /api/courses?search=&category=&level=&page=&pageSize=
GET /api/courses/{id}
(Admin) POST /api/courses
(Admin) PUT /api/courses/{id}
(Admin) DELETE /api/courses/{id}

# Enrollments

(Student) POST /api/enrollments/enroll/{courseId}
(Student) GET /api/enrollments/student/{userId}?page=&pageSize=
(Student) PUT /api/enrollments/{id}/progress
(Admin) GET /api/enrollments/admin?courseId=&userId=&search=&page=&pageSize=
(Admin) PUT /api/enrollments/{id}/admin
(Admin) DELETE /api/enrollments/{id}

# Materials (Week 4)

GET /api/courses/{id}/materials
(Admin) POST /api/courses/{id}/materials/url
(Admin) POST /api/courses/{id}/materials/file (multipart)
(Admin) DELETE /api/materials/{id}

# 🧭 UX Notes

Routing after login: Admin → /admin/courses, Student → /catalog
Logout: clears auth and redirects to /login
Buttons/Inputs: styled for contrast (dark theme); native selects readable (light popup)
Role-aware nav: hide admin links for students and vice versa

# 🧰 Troubleshooting

CORS: Browser blocks preflight
Ensure WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod() and app.UseCors("ViteDevCors") before auth.
DB already has old schema
Create a new migration for added columns/tables or delete minilms.db (dev only) and run dotnet ef database update.
Uploads 404
Ensure app.UseStaticFiles() and files exist under wwwroot/uploads/....
Ports mismatch
Frontend axios base must point to your API’s active port.

# ✅ Status

Week 2: Role-based auth, Catalog, Admin course CRUD — Done
Week 3: Enrollments (student + admin), filters, pagination, docs — Done
Week 4: Materials (URL/file), UI polish, docs — Done