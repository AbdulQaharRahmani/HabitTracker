import { create } from "zustand"

const useAddHabitStore = create((set) => ({
    isModalOpen: true,
    habitData: {
        title: "",
        description: "",
        frequency: null,
        category: null,
    },
    setModalOpen: () => {
        set((state) => ({ isModalOpen: !state.isModalOpen }))
    },
    setHabitData: (item, value) => {
        set((state) => ({
            habitData: {
                ...state.habitData,
                [item]: value
            }
        }))
    }




}))

export default useAddHabitStore
