import { create } from "zustand";

export const useTaskCardStore = create((set) => ({
  tasks: [
    {
      id: 1,
      title: "Complete project proposal",
      deadline: "Yesterday",
      category: "Work",
      done: false,
    },
    {
      id: 2,
      title: "Buy groceries for the week",
      deadline: "Today",
      category: "Personal",
      done: false,
    },
    {
      id: 3,
      title: "Schedule dentist appointment",
      deadline: "Tomorrow",
      category: "Health",
      done: false,
    },
    {
      id: 4,
      title: "Call Mom",
      deadline: "No date",
      category: "Family",
      done: false,
    },
  ],

    toggleTaskDone: (id) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, done: !task.done } : task
            ),
        })
    ),

    deleteTask: (id) => 
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id)
        }),
    )


}));
