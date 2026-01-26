import api from "./api";

export const getProfilePicture = (userId) => {
  return api.get(`/users/${userId}/profile-picture`);
};

export const uploadProfilePicture = (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  return api.post('/users/profile-picture', formData);
};


export const updateUserPrefrences = (preferences) => {
  return api.put(`/users/preference`, preferences);
}

export const getUserPrefrences = () => {
  return api.get(`/users/preference`);
}



