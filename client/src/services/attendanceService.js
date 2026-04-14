import api from './api';

export const markAttendance = async (data) => {
  const response = await api.post('/attendance', data);
  return response.data;
};

export const markBulkAttendance = async (data) => {
  const response = await api.post('/attendance/bulk', data);
  return response.data;
};

export const getStudentAttendance = async (studentId) => {
  const response = await api.get(`/attendance/${studentId}`);
  return response.data;
};

export const getAttendancePercentage = async (studentId, courseId) => {
  const response = await api.get(`/attendance/percentage/${studentId}/${courseId}`);
  return response.data;
};