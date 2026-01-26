import { create } from 'zustand';
import { getProfilePicture, updateUserPrefrences, uploadProfilePicture } from '../../services/userProfileService';

const DEFAULT_AVATAR =
  'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg';

export const useProfilePhotoStore = create((set) => ({
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
      const res = await api.get("/users/preference");
      set({ preferences: res.data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  updateUserPrefrences: async (preferences) => {
    try {
      set({ loading: true });
      await updateUserPrefrences(null, preferences);
      set({ preferences });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  }
}));
