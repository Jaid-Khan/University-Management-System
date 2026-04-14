import { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { Plus, UserPlus, BookOpen } from 'lucide-react';
import { getCourses, createCourse, assignTeacher, enrollStudent, getCourseStudents } from '../../services/courseService';
import { getUsers } from '../../services/userService';
import toast from 'react-hot-toast';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, usersRes] = await Promise.all([
        getCourses(),
        getUsers(),
      ]);
      setCourses(coursesRes.data);
      const teachersList = usersRes.data.filter(u => u.role === 'teacher');
      const studentsList = usersRes.data.filter(u => u.role === 'student');
      setTeachers(teachersList);
      setStudents(studentsList);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourse(formData);
      toast.success('Course created successfully');
      setShowCourseModal(false);
      setFormData({ name: '', code: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (courseId, teacherId) => {
    try {
      await assignTeacher(courseId, teacherId);
      toast.success('Teacher assigned successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to assign teacher');
    }
  };

  const handleEnrollStudent = async (courseId, studentId) => {
    try {
      await enrollStudent(courseId, studentId);
      toast.success('Student enrolled successfully');
      fetchData();
      setShowEnrollModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll student');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Courses</h1>
            <p className="text-gray-600 mt-1">Create and manage courses</p>
          </div>
          <button onClick={() => setShowCourseModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            Add Course
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-500">Code: {course.code}</p>
                </div>
                <BookOpen className="text-primary-600" size={24} />
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Teacher:</label>
                  <select
                    className="ml-2 px-2 py-1 border rounded text-sm"
                    value={course.teacher?._id || ''}
                    onChange={(e) => handleAssignTeacher(course._id, e.target.value)}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                    ))}
                  </select>
                  {course.teacher && (
                    <span className="ml-2 text-sm text-green-600">✓ {course.teacher.name}</span>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Students Enrolled:</label>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEnrollModal(true);
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm flex items-center gap-1"
                    >
                      <UserPlus size={14} />
                      Enroll Student
                    </button>
                  </div>
                  <div className="max-h-32 overflow-y-auto">
                    {course.students?.length > 0 ? (
                      course.students.map(student => (
                        <div key={student._id} className="text-sm text-gray-600 py-1">
                          • {student.name} ({student.email})
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No students enrolled</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Total: {course.students?.length || 0} students</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Code</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
                <button type="button" onClick={() => setShowCourseModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2">Enroll Student</h2>
            <p className="text-gray-600 mb-4">Course: {selectedCourse.name}</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {students.filter(s => !selectedCourse.students?.some(enrolled => enrolled._id === s._id)).map(student => (
                <div key={student._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                  <button
                    onClick={() => handleEnrollStudent(selectedCourse._id, student._id)}
                    className="btn-primary text-sm px-3 py-1"
                  >
                    Enroll
                  </button>
                </div>
              ))}
              {students.filter(s => !selectedCourse.students?.some(enrolled => enrolled._id === s._id)).length === 0 && (
                <p className="text-center text-gray-500 py-4">No available students to enroll</p>
              )}
            </div>
            <button onClick={() => setShowEnrollModal(false)} className="btn-secondary w-full mt-4">
              Close
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ManageCourses;