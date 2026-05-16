import api from "../api/axios";

export const getCourseLectures = async (courseId) => {
  const response = await api.get(`/courses/${courseId}/lectures`);
  return response.data;
};

export const addLecture = async (courseId, lectureData) => {
  const response = await api.post(`/courses/${courseId}/lectures`, lectureData);
  return response.data;
};

export const updateLecture = async (lectureId, lectureData) => {
  const response = await api.put(`/lectures/${lectureId}`, lectureData);
  return response.data;
};

export const deleteLecture = async (lectureId) => {
  await api.delete(`/lectures/${lectureId}`);
};
