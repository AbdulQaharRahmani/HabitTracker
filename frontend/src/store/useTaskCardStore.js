import { create } from "zustand";

export const useTaskCardStore = create((set) => ({
  tasks: [
    {
      id: 1,
      title: "Complete project proposal",
      description: "This is the description part",
      deadline: "Yesterday",
      category: "Work",
      done: false,
    },
    {
      id: 2,
      title: "Buy groceries for the week",
      description: "This is the description part",
      deadline: "Today",
      category: "Personal",
      done: false,
    },
    {
      id: 3,
      title: "Schedule dentist appointment",
      description: "This is the description part",
      deadline: "Tomorrow",
      category: "Health",
      done: false,
    },
    {
      id: 4,
      title: "Call Mom",
      description: "This is the description part",
      deadline: "No date",
      category: "Family",
      done: false,
    },
  ],

  isModalOpen: false,

  taskData: {
    title: "",
    description: "",
    deadline: null,
    category: null,
  },

  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    })),

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
  },

  setModalOpen: () => {
    set((state) => ({
      isModalOpen: !state.isModalOpen,
    }));
  },

  setTaskData: (item, value) => {
    set((state) => ({
      taskData: {
        ...state.taskData,
        [item]: value,
      },
    }));
  },

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  
}));