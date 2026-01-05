import dayjs from 'dayjs';
import { AppError, notFound } from '../utils/error.js';
import { HabitModel } from '../models/Habit.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';
import { DateHelper } from '../utils/date.js';
import { HabitCompletionModel } from '../models/HabitCompletion.js';
import { CategoryModel } from '../models/Category.js';

// Get all user habits
export const getHabits = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const habits = await HabitModel.findByUserAndSortByOrder(req.user._id);

  res.status(200).json({
    success: true,
    result: habits.length,
    data: habits,
  });
};

// Get all user habits for selected date
export const getHabitsByDate = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  // 1) Get date from query
  const dateString = req.query.date;
  const selectedDate = dateString
    ? dayjs(dateString, 'YYYY-MM-DD', true)
    : dayjs();

  if (dateString && !selectedDate.isValid())
    throw new AppError('Invalid date format', 400);

  const startOfDay = selectedDate.startOf('day').toDate();
  const endOfDay = selectedDate.endOf('day').toDate();

  // 2) Fetch habits
  const habits = await HabitModel.find({
    userId: req.user._id,
    createdAt: { $lte: endOfDay },
  }).populate('categoryId', 'name backgroundColor icon');

  const completionHabits = await HabitCompletionModel.find({
    userId: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  // 3) store completions habits ids into a set for faster lookup
  const habitCompletionIds = new Set(
    completionHabits.map((c) => c.habitId.toString())
  );

  // 4) filter by frequency and create new results
  const results = habits
    .filter((habit) => {
      return isHabitForSelectedDay(habit, selectedDate);
    })
    .map((habit) => ({
      _id: habit._id,
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      category: habit.categoryId,
      completed: habitCompletionIds.has(habit._id.toString()),
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
    }));

  res.status(200).json({
    success: true,
    data: results,
  });
};

// Create user habit
export const createHabit = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { title, description, frequency, categoryId } = req.body;

  const doesCategoryExist = await CategoryModel.doesCategoryExist(
    categoryId,
    req.user._id
  );

  if (!doesCategoryExist) throw notFound('Category');

  let habitCount = await HabitModel.getHabitCountByUserId(req.user._id);

  const habit = await HabitModel.create({
    userId: req.user._id,
    title,
    description,
    frequency,
    order: habitCount + 1,
    categoryId,
  });

  res.status(201).json({
    success: true,
    data: habit,
  });
};

export const updateHabit = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const habit = await HabitModel.findById(req.params.id);
  if (!habit) throw notFound('Habit');

  if (!habit.isOwner(req.user._id))
    throw new AppError('You are not allowed to update this habit', 403);

  const { title, description, frequency, categoryId } = req.body;

  const doesCategoryExist = await CategoryModel.doesCategoryExist(
    categoryId,
    req.user._id
  );

  if (!doesCategoryExist) throw notFound('Category');

  if (title !== undefined) habit.title = title;
  if (description !== undefined) habit.description = description;
  if (frequency !== undefined) habit.frequency = frequency;

  habit.categoryId = categoryId;

  await habit.save();

  res.status(200).json({
    success: true,
    data: habit,
  });
};

export const deleteHabit = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const habit = await HabitModel.findById(req.params.id);
  if (!habit) throw notFound('Habit');

  if (!habit.isOwner(req.user._id))
    throw new AppError('You are not allowed to delete this habit', 403);

  habit.isDeleted = true;
  await habit.save();

  res.status(200).json({
    success: true,
    message: 'habit deleted successfully',
  });
};

export const reorderHabits = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  //* request body has this structure => {
  //   "habits": [
  //     { "_id": "habitId1", "order": 1 },
  //     { "_id": "habitId2", "order": 2 }
  //   ]
  // }

  const { habits } = req.body;

  if (!habits) throw new AppError('No habits provided', 400);

  const habitIds = habits.map((h) => h._id);

  const userHabits = await HabitModel.find({
    _id: { $in: habitIds },
    userId: req.user._id,
  }).select('_id');

  if (userHabits.length !== habits.length)
    throw new AppError('Not allowed to modify these habits', 403);

  const operations = habits.map((habit) => {
    return {
      updateOne: {
        filter: { _id: habit._id },
        update: { $set: { order: habit.order } },
      },
    };
  });

  await HabitModel.bulkWrite(operations);

  res.status(200).json({
    success: true,
    message: 'Habits order updated successfully',
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
