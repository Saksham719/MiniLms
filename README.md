## 🛠️ Tech Stack
- Backend → ASP.NET Core 8, Entity Framework Core, SQLite, JWT Auth
- Frontend → Vite, React, React Router, React Query, Axios

## 🚀 Setup & Run
- Backend (API)
- cd backend/MiniLms.Api
- dotnet restore
- dotnet ef database update
- dotnet run


## API base URL (dev): http://localhost:5237

- If you changed ports, update the frontend API_BASE accordingly.

- Frontend (Web)
- cd frontend/minilms
- npm install
- npm run dev


## UI base URL (dev): http://localhost:5173

## 👥 Default Accounts

- These come from the seed data.
- Admin → admin@mini.com / Admin@123
- Student → student@mini.com / Student@123

## (If you changed the emails in the seeder, use those instead.)

## 🔐 Login / Register

- Navigate to / → Login page.
- Use the default credentials above or register a new user.
- New users default to the Student role.
## Post-login landing:
- Admin → redirected to /admin/courses
- Student → redirected to /catalog

## 📚 Student Flow (Enroll + Dashboard)

- Browse Catalog
- Go to /catalog. Use search/filters (category, level) as needed.
## Open a Course
-Click a course card → /courses/:id detail page.
## Enroll
- Click Enroll (visible for Student role).
- You’ll see a success toast if enrollment is created (duplicates are prevented).
# Student Dashboard (progress)
- Go to /dashboard (or your Student dashboard route).
- See your enrolled courses with Progress and Enrolled date.
- Update progress by typing a value (0–100) and blurring the input (or using the Save action if present).

# 🛠️ Admin Flow (Courses + View/Edit/Delete Enrollments)
- Admin Courses
- Go to /admin/courses.
- Filter with Search / Category / Level
- Add, Edit, or Delete courses
- Cards show title, meta, description snippet, duration, and publish badge.
- Per-course Enrollments
- On any course card click View Enrollments → /admin/courses/:id/enrollments
- Table shows Student, Email, Progress, Enrolled, Last Accessed
- Edit progress: change the number (0–100) then Save
- Delete: remove an enrollment (prompt confirms)
- Pagination is available at the bottom

# Admin also has a global enrollments view (optional) if you added it; the per-course page is required for Week-3.

# 📦 API Endpoints (used this week)

- Auth
- POST /api/auth/login
- POST /api/auth/register
# Courses

- GET /api/courses?search=&category=&level=&page=&pageSize=
- GET /api/courses/{id}

# (Admin) POST /api/courses, PUT /api/courses/{id}, DELETE /api/courses/{id}

- Enrollments
- (Student) POST /api/enrollments/enroll/{courseId}
- (Student) GET /api/enrollments/student/{userId}?page=&pageSize=
- (Student) PUT /api/enrollments/{id}/progress (updates own enrollment)
- (Admin) GET /api/enrollments/admin?courseId=&userId=&search=&page=&pageSize=
- (Admin) PUT /api/enrollments/{id}/admin (edit progress)
- (Admin) DELETE /api/enrollments/{id} (delete enrollment)

# 🧭 Week-3 Checklist

- Student can Enroll in a course (no duplicates)
-  Student Dashboard with pagination & progress update
-  Admin Courses page with filters, pagination, and actions
-  Admin View Enrollments per course with Edit/Delete
-  JWT roles enforced on endpoints