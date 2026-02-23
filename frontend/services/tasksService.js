import api from "./api";

export const getTasks = async (limit, page) => {
  try {
    const response = await api.get(`tasks/?limit=${limit}&page=${page}`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch tasks from server";
    throw new Error(message);
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update task status";
    throw new Error(message);
  }
};

export const deleteTask = async (taskId) => {
   try {
     const response = await api.delete(`/tasks/${taskId}`);
     return response.data;
   } catch (error) {
     console.error(
       "Delete task failed:",
       error.response?.data || error.message,
     );
     throw error;
   }
}
