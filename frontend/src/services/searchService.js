import api from "../api/axios";

// Search courses by title (case insensitive)
export const searchCourses = async (query) => {
  if (!query || query.trim() === "") {
    const response = await api.get("/courses");
    return response.data;
  }
  const response = await api.get(
    `/courses/search?title=${encodeURIComponent(query)}`,
  );
  return response.data;
};

// Get courses by instructor name
export const getCoursesByInstructor = async (instructorName) => {
  const response = await api.get(
    `/courses/instructor/${encodeURIComponent(instructorName)}`,
  );
  return response.data;
};

// Get courses by category (if you add categories later)
export const getCoursesByCategory = async (category) => {
  const response = await api.get(
    `/courses/category/${encodeURIComponent(category)}`,
  );
  return response.data;
};
