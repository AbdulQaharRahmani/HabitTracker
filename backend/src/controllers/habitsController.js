import { HabitModel } from '../models/Habit.js';

export const createHabit = async (req, res) => {
  const { userId, title, description, frequency } = req.body;

  const habit = await HabitModel.create({
    userId,
    title,
    description,
    frequency,
  });

  res.status(201).json(habit);
};
