import api from "./api";
import { formatDate } from "../src/utils/dateFormatter"
export const getHabitsByDate = async (date) => {
   const formattedDate = formatDate(date)
   const response = await api.get(`/habits/date?date=${formattedDate}`);
   return response.data.data;
};

export const completeHabit = (id, data) =>
  api.post(`/habits/${id}/complete`, data)

export const unCompleteHabit = (id, data) =>
   api.post(`/habits/${id}/uncomplete`, data)

export const getHabitsChartData = async (startDate, endDate) => {
   const response = await api.get(`/habits/dashboard/chart-data?startDate=${startDate}&endDate=${endDate}`)
   return response.data;
}

export const getChartData = async () => {
   const response = await api.get(`/habits/dashboard/chart-data`)
   return response.data.data
}
