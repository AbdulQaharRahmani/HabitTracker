import { create } from "zustand"
import api from "../../services/api"
import toast from "react-hot-toast";
import { getHabitsByDate } from "../../services/habitService";
const useHabitStore = create((set, get) => ({
    habits: [],
    loading: false,
    error: null,
    selectedDate: new Date(),
    setSelectedDate: (date) => {
        set({ selectedDate: date })
        get().fetchHabitsByDate(date)
    },
    fetchHabitsByDate: async () => {
        set({ loading: true, error: null });
        try {
            const habits = await getHabitsByDate(get().selectedDate);
            set({ habits, loading: false });
        } catch (err) {
            console.log(err)
            set({
                error: err.response?.data?.message || "Failed to load habits",
                loading: false,
            });
        }
    },
    toggleHabit: async (id) => {
       const habitToToggle = get().habits.find(habit=> habit._id === id)
        set((state) => ({
            habits: state.habits.map((habit) =>
                habit._id === id ? { ...habit, completed: !habit.completed } : habit
            ),
        }));
        const newState =  habitToToggle.completed
        try {
            if (habitToToggle.completed) {
                await api.delete(`/habits/${id}/complete`)
            } else {
                await api.post(`/habits/${id}/complete`)
            }

        } catch (err) {
            console.log(err)
            set((state) => ({
            habits: state.habits.map((habit) =>
                habit._id === id ? { ...habit, completed: newState } : habit
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
}))

export default useHabitStore
