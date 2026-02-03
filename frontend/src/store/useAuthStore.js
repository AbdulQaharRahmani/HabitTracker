import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,
      username:null,

      login: (token, id,username) => {
        set({
          token,
          userId: id,
          isAuthenticated: true,
          username,
        });
      },

      logout: () => {
        set({
          token: null,
          userId: null,
          isAuthenticated: false,
          username:null,
        });
        localStorage.removeItem("auth-data");
      },
    }),
    {
      name: "auth-data",
    }
  )
);

export default useAuthStore;
