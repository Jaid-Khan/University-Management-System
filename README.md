# 🎓 University Management System (MVP)

A full-stack University Management System built with MERN stack implementing Authentication, Role-Based Access Control (RBAC), Attendance, Results, and Course Management.

---

# 🚀 MVP Features

## 🔐 1. Authentication & Authorization (RBAC)
- User login (Admin / Teacher / Student)
- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes (frontend + backend)
- Password hashing using bcrypt

---

## 👨‍🎓 2. User Management
- Create users (Admin only)
- Assign roles (Admin, Teacher, Student)
- View all users
- Update / delete users (Admin control)

---

## 📚 3. Course Management
- Create courses (e.g., CS101, Math)
- Assign teacher to courses
- Enroll students in courses
- View course details

---

## 🧑‍🏫 4. Teacher Module
- View assigned courses
- Manage students in courses
- Mark attendance
- Upload marks/results

---

## 🎓 5. Student Module
- View enrolled courses
- Check attendance records
- View results/grades
- View profile details

---

## 📅 6. Attendance System
- Mark attendance (Teacher)
- View attendance reports (Student/Admin)
- Attendance percentage calculation
- Filter by course and date

---

## 📝 7. Result / Grade System
- Add marks (Teacher/Admin)
- Automatic grade calculation (A, B, C, etc.)
- View results by student
- Subject-wise performance tracking

---

## 📊 8. Dashboard (MVP Level)
- Admin dashboard (users, courses overview)
- Teacher dashboard (assigned classes)
- Student dashboard (attendance + results summary)

---

## 🔄 9. API Layer (Backend Core)
- REST APIs for all modules:
  - Authentication APIs
  - User APIs
  - Course APIs
  - Attendance APIs
  - Result APIs
- Centralized error handling middleware
- Async handler for clean API structure

---

## 🧠 10. Core Business Logic
- Grade calculation logic
- Attendance percentage calculation
- Role-based data filtering

---

# ⚡ MVP Workflow
- Login → Role Access → Course Management → Attendance → Results → Dashboard


---

# 🛠️ Tech Stack
- Frontend: React.js, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt

---

# 📌 Project Status
🚧 MVP Phase Completed (Core System Ready)
