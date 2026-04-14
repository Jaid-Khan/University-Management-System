import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { getStudentAttendance } from '../../services/attendanceService';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await getStudentAttendance(user?.id);
      setAttendance(response.data);
      setStats(response.stats);
    } catch {
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  if (loading) return <Layout><div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Attendance</h1>
          <p className="text-gray-600 mt-1">View your attendance records</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Classes</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-green-600">{stats.present}</p>
              <p className="text-sm text-gray-600">Present</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-sm text-gray-600">Absent</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.percentage}%</p>
              <p className="text-sm text-gray-600">Attendance %</p>
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Attendance Records</h3>
          <div className="space-y-3">
            {attendance.map(record => (
              <div key={record._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-400" />
                  <div>
                    <p className="font-medium">{record.course?.name}</p>
                    <p className="text-sm text-gray-500">{record.date}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                  record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {record.status === 'present' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span className="capitalize">{record.status}</span>
                </div>
              </div>
            ))}
            {attendance.length === 0 && (
              <p className="text-center text-gray-500 py-8">No attendance records found</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyAttendance;