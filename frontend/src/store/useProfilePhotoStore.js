import { create } from "zustand";
import { getProfilePicture, uploadProfilePicture } from "../../services/userProfileService";



const DEFAULT_AVATAR =
  'https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg';


export const useProfilePhotoStore = create((set) => ({
    profileUrl: DEFAULT_AVATAR,
    loading: false,
    error: null,
    fetchProfilePhoto: async (userId) => {
        try {
            set({ loading: true, error: null });

            const response = await getProfilePicture(userId);

            if (response.data?.success && response.data?.data) {

                set({ profileUrl: response.data.data });

            }
        } catch (error) {
            console.error('Fetch profile photo error:', error);
            set({ error: 'Failed to load profile photo' });
        } finally {
            set({ loading: false });
       }
    },

    uploadProfilePhoto:async (file, userId) => {
    try {
      set({ loading: true, error: null });

      await uploadProfilePicture(file);

      const response = await getProfilePicture(userId);

      if (response.data?.success && response.data?.data) {
        set({ profileUrl: response.data.data });
      }
    } catch (error) {
      console.error('Upload profile photo error:', error);
      set({ error: 'Failed to upload profile photo' });
    } finally {
      set({ loading: false });
    }
  },
}))

