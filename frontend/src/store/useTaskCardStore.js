import { create } from "zustand";
import { deleteTask, getTasks, updateTaskStatus } from "../../services/tasksService";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useTransition } from "react";

export const useTaskCardStore = create((set, get) => ({
  tasks: [],
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

  completeTask: async (id) => {
    const { tasks } = get();
    const task = tasks.find((task) => task._id === id);

    if (!task) return;

    set({
      tasks: tasks.map((task) =>
        task._id === id
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task,
      ),
    });

    try {
      await updateTaskStatus(id, task.status === "done" ? "todo" : "done");
    } catch (err) {
      set({
        tasks: tasks.map((task) =>
          task._id === id ? { ...task, status: task.status } : task,
        ),
        error: "Failed to update task completion",
      });
    }
  },

  deleteTask: async (id, t) => {
    try {
      const task = get().tasks.find((t) => t._id === id);
      if (!task) console.log("Sorry! task is not found");

      await deleteTask(id)

      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
      }));

      toast.success(t("Task deleted successfully!"))
      
    } catch (error) {
      console.error(
        "Sorry! task deletion failed:",
        error.response?.data || error.message,
      );
      toast.error(t("Failed to delete task"))
      set({ error: "Failed to delete task" });
    }
  },

}));