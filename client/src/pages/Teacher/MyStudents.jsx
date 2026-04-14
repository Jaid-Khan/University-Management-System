import { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { getCourses, getCourseStudents } from '../../services/courseService';
import { getStudentAttendance } from '../../services/attendanceService';
import { getStudentResults } from '../../services/resultService';
import { Users, CalendarCheck, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const MyStudents = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    }
  };

  const fetchStudents = async (courseId) => {
    try {
      const response = await getCourseStudents(courseId);
      setStudents(response.students);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedStudent(null);
    setStudentDetails(null);
    if (courseId) {
      fetchStudents(courseId);
    } else {
      setStudents([]);
    }
  };

  const viewStudentDetails = async (student) => {
    setLoading(true);
    setSelectedStudent(student);
    try {
      const [attendanceRes, resultsRes] = await Promise.all([
        getStudentAttendance(student._id),
        getStudentResults(student._id),
      ]);
      
      setStudentDetails({
        attendance: attendanceRes.data,
        attendanceStats: attendanceRes.stats,
        results: resultsRes.data,
        resultStats: resultsRes.stats,
      });
    } catch (error) {
      toast.error('Failed to fetch student details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Students</h1>
          <p className="text-gray-600 mt-1">View and manage your students</p>
        </div>

        <div className="card">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              className="input"
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>

          {students.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={20} />
                Enrolled Students ({students.length})
              </h3>
              <div className="space-y-2">
                {students.map(student => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => viewStudentDetails(student)}
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && studentDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl m-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Attendance Section */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CalendarCheck size={20} className="text-blue-600" />
                      Attendance Overview
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{studentDetails.attendanceStats?.total || 0}</p>
                        <p className="text-sm text-gray-600">Total Classes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{studentDetails.attendanceStats?.present || 0}</p>
                        <p className="text-sm text-gray-600">Present</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{studentDetails.attendanceStats?.absent || 0}</p>
                        <p className="text-sm text-gray-600">Absent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{studentDetails.attendanceStats?.percentage || 0}%</p>
                        <p className="text-sm text-gray-600">Attendance %</p>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FileText size={20} className="text-green-600" />
                      Results Overview
                    </h3>
                    {studentDetails.results?.length > 0 ? (
                      <>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">Average Percentage: <span className="font-semibold text-green-600">{studentDetails.resultStats?.averagePercentage || 0}%</span></p>
                          <p className="text-sm text-gray-600">Total Exams: {studentDetails.resultStats?.totalExams || 0}</p>
                        </div>
                        <div className="space-y-2">
                          {studentDetails.results.map(result => (
                            <div key={result._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium">{result.course?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{result.examType}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{result.marksObtained}/{result.totalMarks}</p>
                                <p className="text-sm text-green-600">{result.percentage}% ({result.grade})</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No results recorded yet</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyStudents;
