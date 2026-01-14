import api from "../../services/api";

export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    const errMsg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      "Server error";

    throw new Error(errMsg);
  }
};
