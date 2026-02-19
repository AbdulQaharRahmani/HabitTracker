import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthLoading: true,

      login: (token, userData) => {
        set((state) => ({
          token,
          user: userData ? userData : state.user,
          isAuthLoading: false,
        }));
      },
      updateUserName: (newUserName)=>{
        set((state)=>{
          if(!state.user){
            return state
          }
          return{
            user: {
              ...state.user,
              username:newUserName
            }
          }
        })
      },
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthLoading: false,
        });
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
