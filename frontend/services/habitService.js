import api from "./api";
import {formatDate} from "../src/utils/dateFormatter"
export const getHabitsByDate = async (date) => {
  const formattedDate = formatDate(date)
  const response = await api.get(`/habits/date?date=${formattedDate}`);
  return response.data.data;
};
export const completeHabit = async (id)=>{
   await api.post(`/habits/${id}/complete`)
}
export const unCompleteHabit = async (id)=>{
   await api.delete(`/habits/${id}/complete`)
}
export const getHabitsChartData = async ()=>{
   const response = await api.get("/habits/dashboard/chart-data")
   return response.data.data
}
