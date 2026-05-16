import api from "../api/axios";

export const getPaginatedCourses = async (
  page = 0,
  size = 9,
  sortBy = "id",
  sortDir = "asc",
) => {
  try {
    const response = await api.get("/courses/paginated", {
      params: { page, size, sortBy, sortDir },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching paginated courses:", error);
    return { content: [], totalPages: 0, totalElements: 0, number: 0 };
  }
};

export const searchPaginatedCourses = async (title, page = 0, size = 9) => {
  try {
    const response = await api.get("/courses/search/paginated", {
      params: { title, page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching paginated courses:", error);
    return { content: [], totalPages: 0, totalElements: 0, number: 0 };
  }
};

// Get courses with different sort options
export const getCoursesSorted = async (
  sortBy = "title",
  sortDir = "asc",
  page = 0,
  size = 9,
) => {
  return getPaginatedCourses(page, size, sortBy, sortDir);
};
