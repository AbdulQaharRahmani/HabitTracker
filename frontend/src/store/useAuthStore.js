import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      username: null,
      isAuthenticated: false,

      // 🔹 login
      login: (token, id, username) => {
        set({
          token,
          userId: id,
          username,
          isAuthenticated: true,
        });
      },

      // 🔹 update username (used by Settings)
      updateUsername: (username) => {
        set((state) => ({
          ...state,
          username,
        }));
      },

      // 🔹 logout
      logout: () => {
        set({
          token: null,
          userId: null,
          username: null,
          isAuthenticated: false,
        });
        localStorage.removeItem("auth-data");
      },
    }),
    {
      name: "auth-data",
    },
  ),
);

export default useAuthStore;
