import { create } from "zustand"
import api from "../../services/api"
const useHabitStore = create((set) => ({
    isModalOpen: false,
    isEditingMode: false,
    currentHabitID: null,
    loading: false,

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
            alert(message)
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
                alert("Successfuly Updated the Habit!")
            } else {
                await api.post("/habits", data);
                alert("Successfuly Added the Habit!")
            }
            set({
                isModalOpen: false,
                habitData: { title: "", description: "", frequency: null, categoryId: null }
            });

        } catch (error) {
            const message = error.response?.data?.error || "Something went wrong";
            alert(message)
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
            alert("Successfully Added the Category")
        } catch (error) {
            const message = error.response?.data?.error || "Something went wrong";
            alert(message)
            console.log("Failed to add user category", error)

        }

    },
    habits: [],
    fetchHabits: async () => {
        set({ loading: true });
        try {
            const response = await api.get("/habits");
            const data = response.data;
            set({ habits: Array.isArray(data) ? data : data.data || [] });
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
