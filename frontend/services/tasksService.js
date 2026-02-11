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
<<<<<<< HEAD
      "Failed to update task status";
    throw new Error(message);
  }
};
=======
      "Failed to update task completion";
    console.log(message);
  }
};

>>>>>>> 7dc6c04b30a3ae29033f49319cbf5456d97b28a5
