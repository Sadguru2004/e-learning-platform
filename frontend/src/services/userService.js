import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  await api.put("/users/change-password", passwordData);
};

export const deleteAccount = async () => {
  await api.delete("/users/account");
};
