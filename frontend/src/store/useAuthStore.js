import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { logout } from "../../services/authServices";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthLoading: false,
      isAuthenticated: false,
      login: (token, userData) => {
        set((state) => ({
          token,
          user: userData ? userData : state.user,
          isAuthLoading: false,
          isAuthenticated: true
        }));
      },




      updateUserName: (newUserName) => {
        set((state) => {
          if (!state.user) {
            return state
          }
          return {
            user: {
              ...state.user,
              username: newUserName
            }
          }
        })
      },
      logout: async () => {
        try {
          await logout()
        } catch (error) {
          console.log(error)
        } finally {
          set({
            token: null,
            user: null,
            isAuthenticated: false
          });
          localStorage.removeItem("userData-storage")
        }

      },
    }),
    {
      name: "userData-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // just store the user data (id, username) not the token
    }
  )
);

export default useAuthStore;
