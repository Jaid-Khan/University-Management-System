import { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/Dashboard/StatCard';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { getUsers } from '../../services/userService';
import { getCourses } from '../../services/courseService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes] = await Promise.all([
        getUsers(),
        getCourses(),
      ]);
      
      const users = usersRes.data;
      const students = users.filter(u => u.role === 'student').length;
      const teachers = users.filter(u => u.role === 'teacher').length;
      
      setStats({
        totalUsers: users.length,
        totalStudents: students,
        totalTeachers: teachers,
        totalCourses: coursesRes.data.length,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your system overview.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={UserCheck}
            color="bg-green-500"
          />
          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={TrendingUp}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            color="bg-orange-500"
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;