import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/Dashboard/StatCard';
import { BookOpen, Users, CheckCircle, Award } from 'lucide-react';
import { getCourses } from '../../services/courseService';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    todayAttendance: 0,
    results: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const coursesRes = await getCourses();
      const myCourses = coursesRes.data.filter(c => c.teacher?._id === user?.id);
      const totalStudents = myCourses.reduce((acc, course) => acc + (course.students?.length || 0), 0);
      
      setStats({
        courses: myCourses.length,
        students: totalStudents,
        todayAttendance: 0,
        results: 0,
      });
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Layout><div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your courses and students</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="My Courses" value={stats.courses} icon={BookOpen} color="bg-blue-500" />
          <StatCard title="Total Students" value={stats.students} icon={Users} color="bg-green-500" />
          <StatCard title="Today's Attendance" value={stats.todayAttendance} icon={CheckCircle} color="bg-purple-500" />
          <StatCard title="Results Added" value={stats.results} icon={Award} color="bg-orange-500" />
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;