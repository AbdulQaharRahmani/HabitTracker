import dayjs from 'dayjs';
import { AppError, notFound } from '../utils/error.js';
import { HabitModel } from '../models/Habit.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';
import { DateHelper } from '../utils/date.js';
import { HabitCompletionModel } from '../models/HabitCompletion.js';

export const getHabits = async (req, res) => {
  if (!req.user) {
    throw new AppError('User is not authorized.', 401);
  }

  const habits = await HabitModel.find({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: habits,
  });
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

export const getHabitsForSelectedDays = async (req, res) => {
  const dateString = req.query.date || dayjs().format('YYYY-MM-DD');
  const date = dayjs(dateString, 'YYYY-MM-DD', true);

  if (!date.isValid()) throw new AppError('Invalid date', 400);

  const startOfDay = date.startOf('day').toDate();
  const endOfDay = date.endOfDay('day').toDate();

  // Fetch all habits
  const habits = await HabitModel.find({ userId: req.user._id });

  // Fetch all completedHabits for this date in one query
  const completedHabits = await HabitCompletionModel.find({
    userId: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  // Create a set of completed habit IDs for O(1) lookup
  const completedHabitsIds = new Set(
    completedHabits.map((c) => c.habitId.toString())
  );

  const results = habits
    .filter((habit) => isHabitForSelectedDay(habit, date))
    .map((habit) => ({
      _id: habit._id,
      title: habit.title,
      frequency: habit.frequency,
      completed: completedHabitsIds.has(habit._id.toString()),
    }));

  res.status(200).json({
    success: true,
    data: results,
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
