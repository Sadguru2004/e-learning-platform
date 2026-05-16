import api from "../api/axios";

export const enrollInCourse = async (courseId) => {
  const response = await api.post(`/enrollments/courses/${courseId}`);
  return response.data;
};

export const getMyEnrolledCourses = async () => {
  const response = await api.get("/enrollments/my-courses");
  return response.data;
};

export const checkEnrollment = async (courseId) => {
  const response = await api.get(`/enrollments/check/${courseId}`);
  return response.data;
};

export const unenroll = async (courseId) => {
  await api.delete(`/enrollments/courses/${courseId}`);
};
