import api from "./api";
import {formatDate} from "../src/utils/dateFormatter"
export const getHabitsByDate = async (date) => {
  const formattedDate = formatDate(date)
  const response = await api.get(`/habits/date?date=${formattedDate}`);
  return response.data.data;
};
