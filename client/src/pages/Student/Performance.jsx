import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { getStudentResults } from '../../services/resultService';
import { getStudentAttendance } from '../../services/attendanceService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Performance = () => {
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      const [resultsRes, attendanceRes] = await Promise.all([
        getStudentResults(user?.id),
        getStudentAttendance(user?.id),
      ]);
      setResults(resultsRes.data || []);
      setAttendance(attendanceRes.stats);
    } catch {
      toast.error('Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const coursePerformance = results.reduce((acc, result) => {
    const courseName = result.course?.name;
    if (!acc[courseName]) {
      acc[courseName] = { total: 0, count: 0 };
    }
    acc[courseName].total += result.percentage;
    acc[courseName].count++;
    return acc;
  }, {});

  const chartData = Object.entries(coursePerformance).map(([name, data]) => ({
    name: name.length > 15 ? name.substring(0, 15) + '...' : name,
    average: (data.total / data.count).toFixed(1),
  }));

  const examTypeData = results.reduce((acc, result) => {
    acc[result.examType] = (acc[result.examType] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(examTypeData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  if (loading) return <Layout><div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Performance Analytics</h1>
          <p className="text-gray-600 mt-1">Track your academic performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Avg. Percentage</p>
                <p className="text-2xl font-bold text-blue-600">{results.length > 0 ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1) : 0}%</p>
              </div>
              <TrendingUp size={32} className="text-blue-500" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Attendance Rate</p>
                <p className="text-2xl font-bold text-green-600">{attendance?.percentage || 0}%</p>
              </div>
              <CalendarCheck size={32} className="text-green-500" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Best Grade</p>
                <p className="text-2xl font-bold text-purple-600">
                  {results.length > 0 ? results.reduce((best, r) => {
                    const gradeOrder = { 'A+': 7, 'A': 6, 'B': 5, 'C': 4, 'D': 3, 'F': 2 };
                    return gradeOrder[r.grade] > gradeOrder[best.grade] ? r : best;
                  }, results[0])?.grade : 'N/A'}
                </p>
              </div>
              <Award size={32} className="text-purple-500" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Exams</p>
                <p className="text-2xl font-bold text-orange-600">{results.length}</p>
              </div>
              <Target size={32} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Course-wise Performance</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#3b82f6" name="Average Percentage" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Exam Distribution</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Performance Trend */}
        {results.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.map((r, idx) => ({ exam: idx + 1, percentage: r.percentage }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="exam" label={{ value: 'Exam Number', position: 'bottom' }} />
                <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={2} name="Percentage" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Performance;