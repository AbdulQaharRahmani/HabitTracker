import { create } from "zustand"

const useAddHabitStore = create((set) => ({
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
    setModalOpen: () => {
        set((state) => ({ isModalOpen: !state.isModalOpen }))
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
            currentHabitID: habit.id,
            loading: false,
            habitData: {
                title: habit.title,
                description: habit.description,
                frequency: habit.frequency,
                categoryId: habit.categoryId,
            },
        })
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

export default useAddHabitStore
