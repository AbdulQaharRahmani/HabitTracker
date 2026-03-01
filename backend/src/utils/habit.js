import { HabitModel } from '../models/Habit.js';

export const getActiveHabitIds = async (userId) => {
  const habits = await HabitModel.find({ userId, isDeleted: false }).select(
    '_id'
  );

  return habits.map((h) => h._id);
};

export const prepareSearchQuery = (
  userId,
  isDeleted = false,
  searchTerm,
  frequency
) => {
  const query = { userId, isDeleted };
  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ];
  }
  if (frequency && frequency !== 'all') {
    query.frequency = frequency;
  }

  return query;
};
