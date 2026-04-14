import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AssignTeacher from './pages/Admin/AssignTeacher';

// Auth Pages
import Login from './pages/Auth/Login';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageCourses from './pages/Admin/ManageCourses';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import MarkAttendance from './pages/Teacher/MarkAttendance';
import AddResult from './pages/Teacher/AddResult';
import MyStudents from './pages/Teacher/MyStudents';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import MyAttendance from './pages/Student/MyAttendance';
import MyResults from './pages/Student/MyResults';
import Performance from './pages/Student/Performance';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="assign-teacher" element={<AssignTeacher />} />
          </Route>
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="attendance" element={<MarkAttendance />} />
            <Route path="results" element={<AddResult />} />
            <Route path="students" element={<MyStudents />} />
          </Route>
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route index element={<StudentDashboard />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="results" element={<MyResults />} />
            <Route path="performance" element={<Performance />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
