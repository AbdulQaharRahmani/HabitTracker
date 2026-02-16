import { create } from "zustand";
import { deleteTask, getTasks, updateTaskStatus } from "../../services/tasksService";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useTransition } from "react";

export const useTaskCardStore = create((set, get) => ({
  tasks: [],
  loading: false,
  tasksLoading: false,
  categoriesLoading: false,
  error: null,
  isModalOpen: false,

  taskData: {
    title: "",
    description: "",
    dueDate: null,
    category: null,
    priority: null,
  },

  setModalOpen: () => {
    set((state) => ({
      isModalOpen: !state.isModalOpen,
      taskData: {
        title: "",
        description: "",
        dueDate: null,
        category: null,
        priority: null,
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
    set({ categoriesLoading: true });
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
      set({ categoriesLoading: false });
    }
  },

  addTask: async (taskPayload) => {
    try {
      const payload = {
        title: taskPayload.title,
        description: taskPayload.description,
        dueDate: taskPayload.dueDate,
        categoryId: taskPayload.categoryId,
        priority: normalizePriorityToEnglish(taskPayload.priority),
      };

      const res = await api.post("/tasks", payload);

      set((state) => {
        const categoryName =
          state.categories.find((c) => c.id === taskPayload.category)?.name ||
          "—";

        return {
          tasks: [
            ...state.tasks,
            {
              _id: res.data.data._id,
              title: taskPayload.title,
              description: taskPayload.description,
              dueDate: taskPayload.dueDate,
              category: categoryName, //for UI
              categoryId: taskPayload.categoryId,
              done: false,
              priority: normalizePriorityToEnglish(taskPayload.priority),
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

  fetchTasks: async (limit, page) => {
    set({ tasksLoading: true, error: null });
    try {
      const response = await getTasks(limit, page);
      set({ tasks: response.data, loading: false });
    } catch (err) {
      set({
        error: err?.message || "An error occurred",
        tasksLoading: false,
      });
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
  
  // Edit task

  isEditModalOpen: false,
  editingTaskId: null,

  openEditModal: async (taskId) => {
    const task = get().tasks.find((t) => t._id === taskId);
    if (!task) {
      console.log("Task not found for editing:", taskId);
      return;
    }

    const { categories, fetchCategories } = get();
    if (categories.length === 0) {
      await fetchCategories();
    }

    const rawCategory = task.categoryId;
    const categoryId =
      typeof rawCategory === "string"
        ? rawCategory
        : (rawCategory?._id ?? null);

    set({
      isEditModalOpen: true,
      editingTaskId: taskId,
      taskData: {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        category: categoryId,
        priority: task.priority,
      },
    });
  },

  closeModal: () =>
    set({
      isEditModalOpen: false,
      editingTaskId: null,
      taskData: {
        title: "",
        description: "",
        dueDate: null,
        category: null,
        priority: null,
      },
    }),

  updateTask: async (taskId, taskPayload) => {

    try {
      const categoryId = taskPayload.categoryId;

      const payload = {
        title: taskPayload.title,
        description: taskPayload.description,
        dueDate: taskPayload.dueDate,
        categoryId: taskPayload.categoryId,
        priority: normalizePriorityToEnglish(taskPayload.priority),
      };

      await api.put(`/tasks/${taskId}`, payload);

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId
            ? {
                ...task,
                ...taskPayload,
                category : categoryId,
                priority: normalizePriorityToEnglish(taskPayload.priority),
              }
            : task,
        ), 
      } 
      
    ));
    } catch (error) {
        console.error("Update task failed:", error.response?.data || error.message);
      throw error;
    }
  },
}));

const normalizePriorityToEnglish = (value) => {
  switch (value) {
    case "زیاد":
      return "high";
    case "متوسط":
      return "medium";
    case "کم":
      return "low";
    case "high":
    case "medium":
    case "low":
      return value;
    default:
      return "medium";
  }
};
