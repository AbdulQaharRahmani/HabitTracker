import { create } from "zustand";
import { getTodayHabits } from "../../services/habitService";

const useHabitStore = create((set) => ({
  habits: [],
  loading: false,
  error: null,
  fetchTodayHabits: async () => {
    set({ loading: true, error: null });
    try {
        const habits = await getTodayHabits();
      set({ habits, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load habits",
        loading: false,
      });
    }
  },
  toggleHabit: (id) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit._id === id ? { ...habit, completed: !habit.completed } : habit
      ),
    }));
    },
}));

export default useHabitStore;
