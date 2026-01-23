import { create } from "zustand";
import { getTasks } from "../../services/tasksService";

export const useTaskCardStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

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
