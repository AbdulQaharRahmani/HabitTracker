import { create } from 'zustand';
import { getProfilePicture, getUserPrefrences, updateUserPrefrences, uploadProfilePicture } from '../../services/userProfileService';

const DEFAULT_AVATAR =
  'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg';

export const useProfilePhotoStore = create((set,get) => ({
  userProfileUrl: DEFAULT_AVATAR,
  loading: false,
  preferences: null,
  error: null,

  fetchProfilePhoto: async (userId) => {
    try {
      set({ loading: true });

      const res = await getProfilePicture(userId);

      if (res.data?.success && res.data?.data) {
        set({ userProfileUrl: res.data.data });
      } else {
        set({ userProfileUrl: DEFAULT_AVATAR });
      }
    } catch (err) {
      console.error(err);
      set({ userProfileUrl: DEFAULT_AVATAR });
    } finally {
      set({ loading: false });
    }
  },

  uploadProfilePhoto: async (file, userId) => {
    try {
      set({ loading: true });

      await uploadProfilePicture(file);
      const res = await getProfilePicture(userId);
      if (res.data?.success && res.data?.data) {
        set({ userProfileUrl: res.data.data });
      }
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

fetchUserPreferences: async () => {
  try {
    set({ loading: true });
    const res = await getUserPrefrences();
    if (res.data?.success) {
      set({ preferences: res.data.data });
    }
  } catch (err) {
    console.error(err);
  } finally {
    set({ loading: false });
  }
},

updateUserPrefrences: async (newSettings) => {
  const currentPrefs = get().preferences || {};
  const merged = { ...currentPrefs, ...newSettings };
  const forbiddenFields = [
    'timezone',
    '_id',
    '__v',
    'userId',
    'createdAt',
    'updatedAt'
  ];
  const sanitizedPayload = Object.keys(merged).reduce((acc, key) => {
    const value = merged[key];

    if (!forbiddenFields.includes(key) && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  try {
    const res = await updateUserPrefrences(sanitizedPayload);
    if (res.data?.success) {
      set({ preferences: res.data.data });
    }
  } catch (err) {
    console.error("Backend Error Details:", err.response?.data);
  }
},
}));
