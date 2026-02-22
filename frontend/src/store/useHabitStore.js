import { create } from "zustand";
import api from "../../services/api";
import toast from "react-hot-toast";
import {
  completeHabit,
  deleteHabitApi,
  getChartData,
  getHabitsByDate,
  getHabitsChartData,
  unCompleteHabit,
} from "../../services/habitService";
import { formatDate } from "../utils/dateFormatter";
import { formatStatstics } from "../utils/formatStatistics";
import i18next from "i18next";
const useHabitStore = create((set, get) => ({
  searchTerm: "",
  isSearching: false,
  habits: [],
  totalCount: 0,
  loading: false,
  consistencyData: null,
  error: null,
  habitCompletions: 0,
  selectedDate: new Date(),
  setSelectedDate: (date) => {
    set({ selectedDate: date });

    if (!get().isSearching) {
      get().fetchHabitsByDate(date);
    }
  },
  setSearchTerm: (term) => {
    set({
      searchTerm: term,
      isSearching: !!term.trim(),
    });
  },

  searchHabits: async () => {
    const { searchTerm, selectedDate } = get();

    if (!searchTerm.trim()) {
      set({ isSearching: false, habits: [] });
      return get().fetchHabitsByDate(selectedDate);
    }

    set({ loading: true, error: null, isSearching: true });

    try {
      const response = await api.get("/habits", {
        params: {
          searchTerm, // 👈 backend expects this exact key
          limit: 20,
          page: 1,
        },
      });

      const habits = response.data.data || [];

      set({
        habits,
        habitCompletions: habits.filter((h) => h.completed).length,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to search habits",
        loading: false,
      });
    }
  },
  fetchHabitsPage: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const { searchTerm, selectedDate } = get();
      const params = { page, limit };

      if (searchTerm) params.searchTerm = searchTerm;
      if (selectedDate) params.date = selectedDate.toISOString().split("T")[0];

      const response = await api.get("/habits", { params });
      const data = response.data;

      const totalPages = data.totalPages || 1;

      set({
        habits: data.data || [],
        totalCount: totalPages * limit,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch habits",
        loading: false,
      });
    }
  },

  fetchHabitsByDate: async () => {
    set({ loading: true, error: null });
    try {
      const habits = await getHabitsByDate(get().selectedDate);
      const completionsCount = habits.filter((habit) => habit.completed).length;
      set({ habits, loading: false, habitCompletions: completionsCount });
    } catch (err) {
      console.log(err);
      set({
        error: err.response?.data?.message || "Failed to load habits",
        loading: false,
      });
    }
  },
  toggleHabit: async (id) => {
    const formatDate = (date) =>
      date.toISOString().split("T")[0];
    if (get().selectedDate.toDateString() !== new Date().toDateString()) {
      return toast.error("You can only mark today's habit as completed or uncompleted")
    }

    const habitToToggle = get().habits.find(h => h._id === id)
    if (!habitToToggle) return

    const prevState = habitToToggle.completed
    const date = formatDate(get().selectedDate)

    set(state => ({
      habits: state.habits.map(h =>
          h._id === id ? { ...h, completed: !h.completed } : h
      ),
      habitCompletions: state.habitCompletions + (prevState ? -1 : 1)
    }))
    try {
      if (prevState) {
        await unCompleteHabit(id, { date })
        toast.success(i18next.t("habit_incomplete"));
      } else {
        await completeHabit(id, { date })
        toast.success(i18next.t("habit_completed"));
      }
    } catch (err) {
      console.log(err)
      toast.error(err.response.data?.message || "Operation Failed Try Again")
      set(state => ({
        habits: state.habits.map(h =>
          h._id === id ? { ...h, completed: prevState } : h
        ),
        habitCompletions: state.habitCompletions + (prevState ? 1 : -1)
      }))
    }
  },
  isModalOpen: false,
  isEditingMode: false,
  currentHabitID: null,

  habitData: {
    title: "",
    description: "",
    frequency: "",
    categoryId: "",
  },
  categories: [],

  setModalOpen: () => {
    set((state) => ({ isModalOpen: !state.isModalOpen }));
  },
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await api.get("/categories");
      const formatted = response.data.data.map((cat) => ({
        id: cat._id,
        name: cat.name,
        value: cat._id,
        color: cat.backgroundColor || "#dbd6f9",
      }));
      set({ categories: formatted });
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
      toast.error(message);
      console.error("Failed to fetch categories", error);
    } finally {
      set({ loading: false });
    }
  },
  submitHabit: async (data, isEditingMode, currentHabitID) => {
    set({ loading: true });
    try {
      if (isEditingMode) {
        await api.put(`/habits/${currentHabitID}`, data);
        toast.success("Successfuly Updated the Habit!");
      } else {
        await api.post("/habits", data);
        toast.success("Habit Added Successfully!");
      }
      set({
        isModalOpen: false,
        habitData: {
          title: "",
          description: "",
          frequency: null,
          categoryId: null,
        },
      });
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
      toast.error(message);
      console.log("Failed to add habit", error);
    } finally {
      set({ loading: false });
    }
  },
  addUserCategory: async (category, color) => {
    const newCategoryData = {
      name: category,
      icon: "",
      backgroundColor: color,
    };
    try {
      await api.post("/categories", newCategoryData);
      toast.success("Successfully Added the Category");
    } catch (error) {
      const message = error.response?.data?.error || "Something went wrong";
      toast.error(message);
      console.log("Failed to add user category", error);
    }
  },
  allhabits: [],
  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/habits");
      const data = response.data;
      set({ allhabits: Array.isArray(data) ? data : data.data || [] });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch habits";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
  openAddHabitModal: () => {
    set({
      isModalOpen: true,
      isEditingMode: false,
      currentHabitID: null,
      loading: false,
      habitData: {
        title: "",
        description: "",
        frequency: "",
        categoryId: "",
      },
    });
  },
  openEditHabitModal: (habit) => {
    set({
      isModalOpen: true,
      isEditingMode: true,
      currentHabitID: habit._id,
      habitData: {
        title: habit.title,
        description: habit.description,
        frequency: habit.frequency,
        categoryId: habit.categoryId,
      },
    });
  },
  setHabitData: (item, value) => {
    set((state) => ({
      habitData: {
        ...state.habitData,
        [item]: value,
      },
    }));
  },
    chartData: [],
    weeklyStatistics: [],
    monthlyStatistics: [],
    yearlyStatistics: [],
    chartLoading: false,
    chartError: null,
    getChartData: async () => {
        const data = await getChartData();
        set({ chartData: data });
    },

    getStatistics: async (mode) => {
        set({chartLoading: true})
        const { chartData } = get();
        const isYearly = mode === 'yearly';

        const source = isYearly ? chartData?.monthly : chartData?.daily;
        if (!source || source.length === 0) return;

        const start = new Date();
        if (mode === 'weekly') start.setDate(start.getDate() - 6);
        else if (mode === 'monthly') start.setDate(start.getDate() - 30);
        else if (mode === 'yearly') start.setMonth(start.getMonth() - 12);
        try{
        const response = await getHabitsChartData(formatDate(start), formatDate(new Date()));
        const rawData = isYearly ? (response.data.monthly || []) : (response.data.daily || []);
        const formatted = formatStatstics(rawData, mode);
        set({ [`${mode}Statistics`]: formatted });
        }catch(error){
        const message = error.response?.data?.message || "Failed to fetch data";
        set({chartError:message})
        }finally{
            set({chartLoading:false})
        }

    },

    getWeeklyStatistics: () => get().getStatistics('weekly'),
    getMonthlyStatistics: () => get().getStatistics('monthly'),
    getYearlyStatistics: () => get().getStatistics('yearly'),

    getConsistencyData: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const result = await getHabitsChartData(startDate, endDate);
      console.log(result);
      if (result.success) {
        set({ consistencyData: result.data.daily, loading: false });
      } else {
        set({ error: "Failed to load data", loading: false });
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch data";
      set({ error: message, loading: false });
    }
  },
  deleteHabit: async (id, t) => {
  try {
    await deleteHabitApi(id);

    set((state) => ({
      habits: state.habits.filter((h) => h._id !== id),
      allhabits: state.allhabits.filter((h) => h._id !== id),
    }));

    toast.success(t("habit deleted successfully!"));
  } catch (error) {
    toast.error(t("Failed to delete habit!"));
    console.error(
      "Delete habit failed:",
      error.response?.data || error.message
    );
    set({ error: "Failed to delete habit" });
  }
},

}));

export default useHabitStore;
