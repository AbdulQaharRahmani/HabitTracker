import { HabitModel } from '../models/Habit.js';

export const getActiveHabitIds = async (userId) => {
  const habits = await HabitModel.find({ userId, isDeleted: false }).select(
    '_id'
  );

  return habits.map((h) => h._id);
};
