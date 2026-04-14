import api from './api';

export const addResult = async (data) => {
  const response = await api.post('/results', data);
  return response.data;
};

export const getStudentResults = async (studentId) => {
  const response = await api.get(`/results/student/${studentId}`);
  return response.data;
};

export const getCourseResults = async (courseId) => {
  const response = await api.get(`/results/course/${courseId}`);
  return response.data;
};
