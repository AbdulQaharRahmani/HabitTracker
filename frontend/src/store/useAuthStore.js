import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,

      login: (token) => {
        localStorage.setItem("token", token)
        set({
          token: token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          isAuthenticated: false,
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
