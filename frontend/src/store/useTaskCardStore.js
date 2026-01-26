import { create } from "zustand";
import api from "../../services/api";

export  const useTaskCardStore = create((set) => ({
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

  loading: false,
  error: null,

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
    }));
  },

  setModalOpen: () => {
    set((state) => ({
      isModalOpen: !state.isModalOpen,
      taskData: {
        title: "",
        description: "",
        deadline: null,
        category: null,
      },
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

  categories: [],

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

  addTask: async (taskPayload) => {
    
    try {
      const payload = {
        title: taskPayload.title,
        description: taskPayload.description,
        deadline: taskPayload.deadline,
        categoryId: taskPayload.categoryId, //for backend
      };

      const res = await api.post("/tasks", payload);

      set((state) => {
        const categoryName =
          state.categories.find((c) => c.id === taskPayload.categoryId)?.name ||
          "—";

        return {
          tasks: [
            ...state.tasks,
            {
              id: res.data?.data?._id || Date.now(),
              title: taskPayload.title,
              description: taskPayload.description,
              deadline: taskPayload.deadline,
              category: categoryName, //for UI
              done: false,
            },
          ],
        };
      });

      return res.data;
    } catch (error) {
      console.error("Add task failed:", error.response?.data || error.message);
      throw error;
    }
  },

}));
