import dayjs from 'dayjs';
import { AppError, notFound } from '../utils/error.js';
import { HabitModel } from '../models/Habit.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';
import { DateHelper } from '../utils/date.js';
import { HabitCompletionModel } from '../models/HabitCompletion.js';

export const getHabits = async (req, res) => {
  if (!req.user) throw new AppError('Unauthorized', 401);

  const dateString = req.query.date;

  const habits = await HabitModel.find({
    userId: req.user._id,
  });

  if (!dateString) {
    return res.status(200).json({
      success: true,
      data: habits,
    });
  }

  const date = dayjs(dateString, 'YYYY-MM-DD', true);
  if (!date.isValid()) throw new AppError('Invalid date', 400);

  const startOfDay = date.startOf('day').toDate();
  const endOfDay = date.endOf('day').toDate();

  const completedHabits = await HabitCompletionModel.find({
    userId: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  const completedHabitsIds = new Set(
    completedHabits.map((c) => c.habitId.toString())
  );

  const results = habits
    .filter((h) => isHabitForSelectedDay(h, date))
    .map((h) => ({
      _id: h._id,
      title: h.title,
      frequency: h.frequency,
      completed: completedHabitsIds.has(h._id.toString()),
    }));

  res.status(200).json({ success: true, data: results });
};

export const createHabit = async (req, res) => {
  if (!req.user) {
    throw new AppError('User is not authorized.', 401);
  }

  const { title, description, frequency } = req.body;

  const habit = await HabitModel.create({
    userId: req.user._id,
    title,
    description,
    frequency,
  });

  res.status(201).json({
    success: true,
    data: habit,
  });
};

//Mark habit as completed.
//Route: Post => api/habits/:id/complete
export const completeHabit = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  const habit = await HabitModel.findById(req.params.id);

  if (!habit) throw notFound('Habit');

  // Validate habit ownership
  if (!habit.isOwner(req.user._id))
    throw new AppError('Not allowed to modify this habit', 403);

  // Validate if habit is completed for the same day
  if (await HabitCompletionModel.isAlreadyCompleted(req.params.id))
    throw new AppError('Habit is already completed', 400);

  const habitCompletion = await HabitCompletionModel.create({
    habitId: habit._id,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: habitCompletion,
  });
};

// Unmark habit completion if exist, otherwise throw error
export const uncompleteHabit = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  const habit = await HabitModel.findById(req.params.id);

  if (!habit) throw notFound('Habit');

  // Validate habit ownership
  if (!habit.isOwner(req.user._id))
    throw new AppError('Not allowed to modify this habit', 403);

  const [startOfToday, endOfToday] = DateHelper.getStartAndEndOfToday();

  const habitCompletion = await HabitCompletionModel.findOneAndDelete({
    habitId: habit._id,
    date: { $gte: startOfToday, $lte: endOfToday },
  });

  if (!habitCompletion) throw notFound('HabitCompletion');

  res.status(200).json({
    success: true,
    data: habitCompletion,
  });
};
