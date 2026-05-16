import api from "../api/axios";

export const getAllCourses = async () => {
  try {
    const response = await api.get("/courses");
    console.log("API Response:", response.data); // Debug log
    return response.data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post("/courses", courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  await api.delete(`/courses/${id}`);
};

export const getMyCourses = async () => {
  const response = await api.get("/courses/my-courses");
  return response.data || [];
};
