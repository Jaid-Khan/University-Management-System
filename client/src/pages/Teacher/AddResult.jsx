import { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { getCourses, getCourseStudents } from '../../services/courseService';
import { addResult } from '../../services/resultService';
import toast from 'react-hot-toast';

const AddResult = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    marksObtained: '',
    totalMarks: '',
    examType: 'midterm',
  });
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
    setFormData({ ...formData, studentId: '' });
    if (courseId) {
      fetchStudents(courseId);
    } else {
      setStudents([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      toast.error('Please select a course');
      return;
    }

    setLoading(true);
    try {
      await addResult({
        ...formData,
        courseId: selectedCourse,
        marksObtained: Number(formData.marksObtained),
        totalMarks: Number(formData.totalMarks),
      });
      toast.success('Result added successfully!');
      setFormData({
        studentId: '',
        marksObtained: '',
        totalMarks: '',
        examType: 'midterm',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add result');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Add Results</h1>
          <p className="text-gray-600 mt-1">Record student exam results</p>
        </div>

        <div className="card max-w-2xl">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                className="input"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
                disabled={!selectedCourse}
              >
                <option value="">Choose a student...</option>
                {students.map(student => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Type
              </label>
              <select
                className="input"
                value={formData.examType}
                onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                required
              >
                <option value="quiz">Quiz</option>
                <option value="midterm">Midterm</option>
                <option value="final">Final</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  className="input"
                  value={formData.marksObtained}
                  onChange={(e) => setFormData({ ...formData, marksObtained: e.target.value })}
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  className="input"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  required
                  min="1"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Adding Result...' : 'Add Result'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddResult;