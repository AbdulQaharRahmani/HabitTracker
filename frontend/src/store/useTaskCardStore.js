import { create } from "zustand";
import { getTasks } from "../../services/tasksService";
import api from "../../services/api";

export const useTaskCardStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  loading: false,
  error: null,

  isModalOpen: false,

  taskData: {
    title: "",
    description: "",
    deadline: null,
    category: null,
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

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  fetchTasks: async (limit, page) => {
    set({ loading: true, error: null });
    try {
      const response = await getTasks(limit, page);

      set({ tasks: response.data, loading: false });
    } catch (err) {
      set({ error: err?.message || "An error occurred", loading: false });
    }
  },
  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        return task._id === id
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task;
      }),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== id),
    })),
}));
