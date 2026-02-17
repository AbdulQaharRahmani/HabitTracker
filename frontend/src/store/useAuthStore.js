import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  username: null,
  userId: null,
  isAuthLoading: true,

  login: (token, username, userId) => {
    set({
      token,
      username,
      userId,
      isAuthLoading: false
    })
  },
  // for setting
  updateUsername: (username) => {
    set((state) => ({
      ...state,
      username,
    }));
  },

  logout: () => {
    set({
      token: null,
      username: null,
      userId: null,
      isAuthLoading: true
    })
  }



}))

export default useAuthStore;
