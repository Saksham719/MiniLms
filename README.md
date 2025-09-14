# 📘MiniLms — Week 2 Project

A minimal Learning Management System (LMS) built with ASP.NET Core (Backend) and React + Vite (Frontend).
This project demonstrates authentication, role-based access, course catalog, and admin management.

# 🛠️ Tech Stack

 - Backend → ASP.NET Core 8, EF Core, SQLite, JWT Auth
 - Frontend → Vite, React, React Router, React Query, Axios

# 🚀 Setup & Run Instructions
Backend (API)
- Navigate to backend folder:
- cd backend/MiniLms.Api
- Restore dependencies:
- dotnet restore
- Apply migrations & update database:
- dotnet ef database update

# Run backend:

 - dotnet run


 # API will run at → http://localhost:5237

# Frontend (Web)

Navigate to frontend folder:

- cd frontend/minilms
- Install dependencies:
- npm install


# Run development server:

- npm run dev


# UI will run at → http://localhost:5173

# 👥 Default Accounts

 - Admin → admin@demo.com / Admin@123
 - Student → student@demo.com / Student@123

# 📖 Step-by-Step Flow
🔹 Login/Register
     - Navigate to / → Login page.
     - Use default credentials or register a new user (new users default to Student role).

🔹 Student Flow
     -  Logs in → Catalog becomes visible.
     -  Can browse available courses.
     -  Course detail pages show title, category, level, duration, and description.

🔹 Admin Flow
     -   Logs in → Navbar shows both Catalog and Admin links.
     -   Admin dashboard → Add new courses, edit existing ones, delete courses.
     -   All changes reflect instantly in the Catalog.

🔹 Logout
     -   Ends session and redirects user to Login page.



