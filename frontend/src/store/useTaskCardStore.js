import { create } from "zustand";
import { temporal } from "zundo";
import {
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "../../services/tasksService";
import api from "../../services/api";
import toast from "react-hot-toast";
import { pushAction, ActionTypes } from "../utils/undoSyncManager";
import { schedulePendingDelete } from "../utils/pendingDeletes";
const normalizePriorityToEnglish = (value) => {
  switch (value) {
    case "زیاد": return "high";
    case "متوسط": return "medium";
    case "کم": return "low";
    case "high":
    case "medium":
    case "low":
      return value;
    default:
      return "medium";
  }
};

export const useTaskCardStore = create(
  temporal(
    (set, get) => ({
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

      setModalOpen: (isOpen) =>
        set((state) => ({
          isModalOpen:
            typeof isOpen === "boolean" ? isOpen : !state.isModalOpen,
        })),

      setTaskData: (item, value) =>
        set((state) => ({
          taskData: { ...state.taskData, [item]: value },
        })),

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
          toast.error(error.response?.data?.error || "Something went wrong");
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
          const newId = res.data.data._id;

          // ✅ Track for undo
          pushAction({
            type: ActionTypes.ADD_TASK,
            id: newId,
            taskData: payload,
          });

          set((state) => {
            const categoryName =
              state.categories.find((c) => c.id === taskPayload.category)
                ?.name || "—";
            return {
              tasks: [
                ...state.tasks,
                {
                  _id: newId,
                  title: taskPayload.title,
                  description: taskPayload.description,
                  dueDate: taskPayload.dueDate,
                  category: categoryName,
                  categoryId: taskPayload.categoryId,
                  done: false,
                  status: "todo",
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
          set({ error: err?.message || "An error occurred", tasksLoading: false });
        }
      },

completeTask: async (id) => {
  const { tasks } = get();
  const task = tasks.find((t) => t._id === id);
  if (!task) return;

  const prevStatus = task.status;
  const newStatus = task.status === "done" ? "todo" : "done";

  pushAction({
    type: ActionTypes.COMPLETE_TASK,
    id,
    previousStatus: prevStatus,
    newStatus,
  });

  set({
    tasks: tasks.map((t) =>
      t._id === id ? { ...t, status: newStatus } : t
    ),
  });

  try {
    await updateTaskStatus(id, newStatus);
  } catch (err) {
    set({
      tasks: tasks.map((t) =>
        t._id === id ? { ...t, status: prevStatus } : t
      ),
      error: "Failed to update task completion",
    });
    toast.error("Failed to update task status");
  }
},

deleteTask: async (id, t) => {
  const taskToDelete = get().tasks.find((tk) => tk._id === id);
  if (!taskToDelete) return;

  pushAction({
    type: ActionTypes.DELETE_TASK,
    id,
    taskData: taskToDelete,
  });

  set((state) => ({
    tasks: state.tasks.filter((task) => task._id !== id),
  }));

  schedulePendingDelete(id, () => deleteTask(id));

  toast.success(t("Task deleted successfully!"));
},

      isEditModalOpen: false,
      editingTaskId: null,

      openEditModal: async (taskId) => {
        const task = get().tasks.find((t) => t._id === taskId);
        if (!task) return;
        const { categories, fetchCategories } = get();
        if (categories.length === 0) await fetchCategories();
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
          taskData: { title: "", description: "", dueDate: null, category: null, priority: null },
        }),

      updateTask: async (taskId, taskPayload) => {
        try {
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
                ? { ...task, ...taskPayload, category: taskPayload.categoryId, priority: normalizePriorityToEnglish(taskPayload.priority) }
                : task
            ),
          }));
        } catch (error) {
          console.error("Update task failed:", error.response?.data || error.message);
          throw error;
        }
      },
    }),
    {
      limit: 50,
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    }
  )
);

export { normalizePriorityToEnglish };
export default useTaskCardStore;
