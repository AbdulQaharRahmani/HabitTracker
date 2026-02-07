import { create } from "zustand"
import api from "../../services/api"
import toast from "react-hot-toast";
import { completeHabit, getChartData, getHabitsByDate, getHabitsChartData, unCompleteHabit } from "../../services/habitService";
import { formatDate } from "../utils/dateFormatter";
const useHabitStore = create((set, get) => ({
    habits: [],
    loading: false,
    consistencyData: null,
    error: null,
    habitCompletions: 0,
    selectedDate: new Date(),
    setSelectedDate: (date) => {
        set({ selectedDate: date })
        get().fetchHabitsByDate(date)
    },
    fetchHabitsByDate: async () => {
        set({ loading: true, error: null });
        try {
            const habits = await getHabitsByDate(get().selectedDate);
            const completionsCount = habits.filter(habit => habit.completed).length
            set({ habits, loading: false, habitCompletions: completionsCount });
        } catch (err) {
            console.log(err)
            set({
                error: err.response?.data?.message || "Failed to load habits",
                loading: false,
            });
        }
    },
    toggleHabit: async (id) => {
        if (get().selectedDate.toDateString() !== new Date().toDateString()) {
            return toast.error("You can only mark today's habit as completed or uncompleted")
        }
        const habitToToggle = get().habits.find(habit => habit._id === id)
        const completionState = habitToToggle.completed
        set((state) => ({
            habits: state.habits.map((habit) =>
                habit._id === id ? { ...habit, completed: !habit.completed } : habit
            ),
        }));
        try {
            if (habitToToggle.completed) {
                await unCompleteHabit(id)
                set((state) => ({ habitCompletions: state.habitCompletions - 1 }))
            } else {
                await completeHabit(id)
                set((state) => ({ habitCompletions: state.habitCompletions + 1 }))

            }

        } catch (err) {
            console.log(err)
            set((state) => ({
                habits: state.habits.map((habit) =>
                    habit._id === id ? { ...habit, completed: completionState } : habit
                ),
            }));

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
        set((state) => ({ isModalOpen: !state.isModalOpen }))
    },
    fetchCategories: async () => {
        set({ loading: true })
        try {
            const response = await api.get("/categories");
            const formatted = response.data.data.map((cat) => ({
                id: cat._id,
                name: cat.name,
                value: cat._id,
                color: cat.backgroundColor || "#dbd6f9"
            }));
            set({ categories: formatted });
        } catch (error) {
            const message = error.response?.data?.error || "Something went wrong";
            toast.error(message)
            console.error("Failed to fetch categories", error);
        } finally {
            set({ loading: false });
        }
    },
    submitHabit: async (data, isEditingMode, currentHabitID) => {
        set({ loading: true })
        try {
            if (isEditingMode) {
                await api.put(`/habits/${currentHabitID}`, data);
                toast.success("Successfuly Updated the Habit!")
            } else {
                await api.post("/habits", data);
                toast.success("Habit Added Successfully!")
            }
            set({
                isModalOpen: false,
                habitData: { title: "", description: "", frequency: null, categoryId: null }
            });

        } catch (error) {
            const message = error.response?.data?.error || "Something went wrong";
            toast.error(message)
            console.log("Failed to add habit", error)
        } finally {
            set({ loading: false });
        }
    },
    addUserCategory: async (category, color) => {
        const newCategoryData = {
            name: category,
            icon: "",
            backgroundColor: color,
        }
        try {
            await api.post("/categories", newCategoryData)
            toast.success("Successfully Added the Category")
        } catch (error) {
            const message = error.response?.data?.error || "Something went wrong";
            toast.error(message)
            console.log("Failed to add user category", error)

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
        })
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
                categoryId: habit.categoryId
            }
        });
    },
    setHabitData: (item, value) => {
        set((state) => ({
            habitData: {
                ...state.habitData,
                [item]: value
            }
        }))
    },
    formatStatstics: (data, mode) => {
        const stats = data.reduce((acc, item) => {
            const dateObj = new Date(item.date + 'T00:00:00');
            let key;

            if (mode === 'daily') key = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            else if (mode === 'monthly') key = dateObj.toLocaleDateString('en-US', { month: 'short' });
            else if (mode === 'yearly') key = item.date.split('-')[0];

            acc[key] = (acc[key] || 0) + item.completed;
            return acc;
        }, {});

        return Object.keys(stats).map(name => ({
            name,
            completed: stats[name]
        }));
    },

    chartData: [],
    dailyStatistics: [],
    monthlyStatistics: [],
    yearlyStatistics: [],

    getChartData: async () => {
        const data = await getChartData();
        set({ chartData: data });
    },

    getStatistics: async (mode) => {
        const { chartData } = get();
        const isMonthly = mode === 'monthly';

        const source = isMonthly ? chartData?.monthly : chartData?.daily;
        if (!source || source.length === 0) return;

        const start = new Date();
        if (mode === 'daily') start.setDate(start.getDate() - 6);
        else if (mode === 'monthly') start.setMonth(start.getMonth() - 5);
        else if (mode === 'yearly') start.setFullYear(start.getFullYear() - 3);

        const firstDataDate = new Date(source[0].date);
        const finalStart = start >= firstDataDate ? start : firstDataDate;

        const response = await getHabitsChartData(formatDate(finalStart), formatDate(new Date()));
        const rawData = isMonthly ? (response.data.monthly || []) : (response.data.daily || []);

        const formatted = get().formatStatstics(rawData, mode);

        set({ [`${mode}Statistics`]: formatted });
    },

    getDailyStatistics: () => get().getStatistics('daily'),
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
}

}))

export default useHabitStore
