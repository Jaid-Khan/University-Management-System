import { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { getCourses, getCourseStudents } from '../../services/courseService';
import { markAttendance, markBulkAttendance } from '../../services/attendanceService';
import toast from 'react-hot-toast';

const MarkAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
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
      const initialData = {};
      response.students.forEach(student => {
        initialData[student._id] = 'present';
      });
      setAttendanceData(initialData);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (courseId) {
      fetchStudents(courseId);
    } else {
      setStudents([]);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    setLoading(true);
    try {
      const studentsList = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status,
      }));

      await markBulkAttendance({
        courseId: selectedCourse,
        students: studentsList,
      });
      
      toast.success('Attendance marked successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mark Attendance</h1>
          <p className="text-gray-600 mt-1">Record student attendance for today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Course
              </label>
              <select
                className="input"
                value={selectedCourse}
                onChange={handleCourseChange}
                required
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
                <h3 className="text-lg font-semibold mb-4">Students</h3>
                <div className="space-y-3">
                  {students.map(student => (
                    <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <div className="flex gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={student._id}
                            value="present"
                            checked={attendanceData[student._id] === 'present'}
                            onChange={() => handleAttendanceChange(student._id, 'present')}
                            className="w-4 h-4 text-green-600"
                          />
                          <span className="text-green-600">Present</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={student._id}
                            value="absent"
                            checked={attendanceData[student._id] === 'absent'}
                            onChange={() => handleAttendanceChange(student._id, 'absent')}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="text-red-600">Absent</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {students.length > 0 && (
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Submitting...' : 'Submit Attendance'}
              </button>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default MarkAttendance;