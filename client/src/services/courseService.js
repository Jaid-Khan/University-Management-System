import api from './api';

export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const assignTeacher = async (courseId, teacherId) => {
  const response = await api.post(`/courses/${courseId}/assign-teacher`, { teacherId });
  return response.data;
};

export const enrollStudent = async (courseId, studentId) => {
  const response = await api.post(`/courses/${courseId}/enroll`, { studentId });
  return response.data;
};

export const getCourseStudents = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/students`);
  return response.data;
};
