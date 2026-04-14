import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import StatCard from '../../components/Dashboard/StatCard';
import { CalendarCheck, Award, TrendingUp, BookOpen } from 'lucide-react';
import { getStudentAttendance } from '../../services/attendanceService';
import { getStudentResults } from '../../services/resultService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    attendance: 0,
    averageMarks: 0,
    courses: 0,
    exams: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [attendanceRes, resultsRes] = await Promise.all([
        getStudentAttendance(user?.id),
        getStudentResults(user?.id),
      ]);
      
      setStats({
        attendance: attendanceRes.stats?.percentage || 0,
        averageMarks: resultsRes.stats?.averagePercentage || 0,
        courses: 0,
        exams: resultsRes.stats?.totalExams || 0,
      });
    } catch {
      toast.error('Failed to fetch dashboard data');
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
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your academic progress</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Attendance Rate" value={`${stats.attendance}%`} icon={CalendarCheck} color="bg-blue-500" />
          <StatCard title="Average Marks" value={`${stats.averageMarks}%`} icon={TrendingUp} color="bg-green-500" />
          <StatCard title="Enrolled Courses" value={stats.courses} icon={BookOpen} color="bg-purple-500" />
          <StatCard title="Exams Taken" value={stats.exams} icon={Award} color="bg-orange-500" />
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;