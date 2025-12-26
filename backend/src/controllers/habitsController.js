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

export const getHabitsByDate = async (req, res) => {
  //------------ Get date
  const dateString = req.query.date;

  const selectedDate = dateString
    ? dayjs(dateString, 'YYYY-MM-DD', true)
    : dayjs();

  if (dateString && !selectedDate.isValid()) {
    throw new AppError('Invalid date format', 400);
  }

  const startOfDay = selectedDate.startOf('day').toDate();
  const endOfDay = selectedDate.endOf('day').toDate();

  //------------- Fetch habits
  const habits = await HabitModel.find({ userId: req.user._id });

  // Fetch habit completions for the selected day
  const completions = await HabitCompletionModel.find({
    userId: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  // Store completed habit IDs in Set for fast lookup
  const completedHabitIds = new Set(
    completions.map((c) => c.habitId.toString())
  );

  //-------- Filter habits by frequency and add completion status
  const results = habits
    .filter((habit) => isHabitForSelectedDay(habit, selectedDate))
    .map((habit) => ({
      _id: habit._id,
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      completed: completedHabitIds.has(habit._id.toString()),
    }));

  res.status(200).json({
    success: true,
    data: results,
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
