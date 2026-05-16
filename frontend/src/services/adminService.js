import api from "../api/axios";

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id, role) => {
  const response = await api.put(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/admin/users/${id}`);
};

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};
