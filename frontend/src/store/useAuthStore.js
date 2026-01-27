import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,

      login: (token, id) => {
        set({
          token,
          userId: id,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          token: null,
          userId: null,
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
