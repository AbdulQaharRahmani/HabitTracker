import api from "./api";

export const getTodayHabits = async () => {
  const response = await api.get("/habits/date?date=2026-11-04");
  return response.data.data;
};
