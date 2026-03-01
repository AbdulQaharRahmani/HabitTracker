import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logout as apiLogout } from "../../services/authServices";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      email: null,

      isAuthLoading: false,
      isAuthenticated: false,
      isRateLimited: false,
      login: (token, userData, userEmail) => {
        set((state) => ({
          token,
          email: userEmail ?? state.email,
          user: userData ? userData : state.user,
          isAuthLoading: false,
          isAuthenticated: true,
        }));
      },
      setRateLimited: (value) =>
        set({
          isRateLimited: value,
        }),
      updateUserName: (newUserName) => {
        set((state) => {
          if (!state.user) return state;

          return {
            user: {
              ...state.user,
              username: newUserName,
            },
          };
        });
      },

      logout: async () => {
        try {
          await apiLogout();
        } catch (error) {
          console.log(error);
        } finally {
          set({
            token: null,
            user: null,
            email: null,
            isAuthenticated: false,
            isRateLimited: false,
          });

          localStorage.removeItem("userData-storage");
        }
      },
    }),

    {
      name: "userData-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        user: state.user,
        email: state.email,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isRateLimited: state.isRateLimited,
      }),
    }
  )
);

export default useAuthStore;
