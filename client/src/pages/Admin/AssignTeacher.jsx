import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { getCourses, assignTeacher } from "../../services/courseService";
import { getUsers } from "../../services/userService";
import { UserCheck, BookOpen, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import ErrorMessage from "../../components/Common/ErrorMessage";

const AssignTeacher = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [coursesRes, usersRes] = await Promise.all([
        getCourses(),
        getUsers(),
      ]);
      setCourses(coursesRes.data);
      const teachersList = usersRes.data.filter((u) => u.role === "teacher");
      setTeachers(teachersList);
    } catch {
      setError("Failed to fetch data. Please try again.");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTeacher = async (courseId, teacherId) => {
    setAssigning((prev) => ({ ...prev, [courseId]: true }));
    try {
      await assignTeacher(courseId, teacherId);
      toast.success("Teacher assigned successfully");
      fetchData(); // Refresh the data
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign teacher");
    } finally {
      setAssigning((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  if (loading)
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <ErrorMessage message={error} onRetry={fetchData} />
      </Layout>
    );

  // Group courses by teacher assignment
  const assignedCourses = courses.filter((c) => c.teacher);
  const unassignedCourses = courses.filter((c) => !c.teacher);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assign Teachers</h1>
          <p className="text-gray-600 mt-1">
            Manage teacher assignments for courses
          </p>
        </div>

        {/* Unassigned Courses */}
        {unassignedCourses.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <XCircle className="text-red-500" size={24} />
              Unassigned Courses ({unassignedCourses.length})
            </h2>
            <div className="space-y-4">
              {unassignedCourses.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <p className="text-sm text-gray-500">
                        Code: {course.code}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        className="input text-sm py-1 px-3"
                        onChange={(e) =>
                          handleAssignTeacher(course._id, e.target.value)
                        }
                        disabled={assigning[course._id]}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select Teacher
                        </option>
                        {teachers.map((teacher) => (
                          <option key={teacher._id} value={teacher._id}>
                            {teacher.name} ({teacher.email})
                          </option>
                        ))}
                      </select>
                      {assigning[course._id] && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>📊 Students Enrolled: {course.students?.length || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Courses */}
        {assignedCourses.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              Assigned Courses ({assignedCourses.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedCourses.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-lg p-4 bg-green-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{course.name}</h3>
                      <p className="text-sm text-gray-600">
                        Code: {course.code}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                        <UserCheck size={16} />
                        <span>Teacher: {course.teacher?.name || "N/A"}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        📊 Students: {course.students?.length || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssignTeacher(course._id, "")}
                      className="text-red-600 hover:text-red-700 text-sm"
                      disabled={assigning[course._id]}
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Courses Message */}
        {courses.length === 0 && (
          <div className="card text-center py-12">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">
              No Courses Available
            </h3>
            <p className="text-gray-500 mt-2">
              Create courses first to assign teachers
            </p>
          </div>
        )}

        {/* Teachers List */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Available Teachers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {teachers.map((teacher) => (
              <div
                key={teacher._id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {teacher.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{teacher.name}</p>
                  <p className="text-xs text-gray-500">{teacher.email}</p>
                </div>
              </div>
            ))}
            {teachers.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-4">
                No teachers available. Create teachers first.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignTeacher;
