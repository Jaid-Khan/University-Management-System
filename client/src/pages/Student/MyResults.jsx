import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { getStudentResults } from '../../services/resultService';
import { Award, TrendingUp, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const MyResults = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchResults = useCallback(async () => {
    try {
      const response = await getStudentResults(user?.id);
      setResults(response.data);
      setStats(response.stats);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error('Failed to fetch results');
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A+': return 'text-purple-600';
      case 'A': return 'text-blue-600';
      case 'B': return 'text-green-600';
      case 'C': return 'text-yellow-600';
      case 'D': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  if (loading) return <Layout><div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></Layout>;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Results</h1>
          <p className="text-gray-600 mt-1">View your academic results</p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp size={24} className="text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.averagePercentage}%</p>
              <p className="text-sm text-gray-600">Average Percentage</p>
            </div>
            <div className="card text-center">
              <div className="flex items-center justify-center mb-2">
                <Award size={24} className="text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats.totalExams}</p>
              <p className="text-sm text-gray-600">Total Exams</p>
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Exam Results
          </h3>
          <div className="space-y-4">
            {results.map(result => (
              <div key={result._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{result.course?.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{result.examType}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getGradeColor(result.grade)}`}>{result.grade}</p>
                    <p className="text-sm text-gray-500">Grade</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Marks Obtained</p>
                    <p className="font-semibold">{result.marksObtained} / {result.totalMarks}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Percentage</p>
                    <p className="font-semibold text-green-600">{result.percentage}%</p>
                  </div>
                </div>
              </div>
            ))}
            {results.length === 0 && (
              <p className="text-center text-gray-500 py-8">No results available yet</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyResults;