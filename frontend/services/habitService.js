import api from "./api";

export const getTodayHabits = async () => {
  const response = await api.get("/habits/date");
  return response.data.data;
};
