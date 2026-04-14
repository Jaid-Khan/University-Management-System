import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  CalendarCheck, 
  FileText, 
  GraduationCap,
  BarChart3,
  UserCheck,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const adminMenus = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Manage Users' },
    { path: '/admin/courses', icon: BookOpen, label: 'Manage Courses' },
    { path: '/admin/assign-teacher', icon: UserCheck, label: 'Assign Teacher' }
  ];

  const teacherMenus = [
    { path: '/teacher', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teacher/attendance', icon: CalendarCheck, label: 'Mark Attendance' },
    { path: '/teacher/results', icon: FileText, label: 'Add Results' },
    { path: '/teacher/students', icon: GraduationCap, label: 'My Students' },
  ];

  const studentMenus = [
    { path: '/student', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/attendance', icon: CalendarCheck, label: 'My Attendance' },
    { path: '/student/results', icon: FileText, label: 'My Results' },
    { path: '/student/performance', icon: BarChart3, label: 'Performance' },
  ];

  let menus = [];
  if (user?.role === 'admin') menus = adminMenus;
  else if (user?.role === 'teacher') menus = teacherMenus;
  else if (user?.role === 'student') menus = studentMenus;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
          EduManage
        </h1>
        <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role} Portal</p>
      </div>
      
      <nav className="mt-6">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                isActive ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
              }`
            }
          >
            <menu.icon size={20} />
            <span>{menu.label}</span>
          </NavLink>
        ))}
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full mt-auto absolute bottom-0 left-0"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
