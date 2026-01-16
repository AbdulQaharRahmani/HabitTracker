import { create } from "zustand";
import api from "../../services/api";

const useHabitStore = create((set) => ({
  habits: [],
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/habits");
      const data = response.data;
      set({
        habits: Array.isArray(data) ? data : data.data || [],
        loading: false,
      });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to fetch habits",
        loading: false,
      });
    }
  },
}));

export default useHabitStore;
