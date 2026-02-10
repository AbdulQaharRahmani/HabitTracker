import dayjs from 'dayjs';
import {
  AppError,
  noFieldsProvidedForUpdate,
  notFound,
  unauthorized,
} from '../utils/error.js';
import { HabitModel } from '../models/Habit.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';
import { CategoryModel } from '../models/Category.js';
import { HabitCompletionModel } from '../models/habitCompletion.js';
import { ERROR_CODES } from '../utils/constant.js';
import { v4 as uuidv4 } from 'uuid';
import { DateHelper } from '../utils/date.js';
import { prepareSearchQuery } from '../utils/habit.js';

// Get all user habits
export const getHabits = async (req, res) => {
  if (!req.user) throw unauthorized();

  const limit = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const searchTerm = req.query.searchTerm;
  const frequency = req.query.frequency;

  const query = prepareSearchQuery(req.user._id, false, searchTerm, frequency);

  const habitsTotal = await HabitModel.countDocuments(query);

  const totalPages = Math.ceil(habitsTotal / limit);

  const habits = await HabitModel.findByUserAndSortByOrder(skip, limit, query);

  res.status(200).json({
    success: true,
    totalPages,
    data: habits,
  });
};

// Get all user habits for selected date
export const getHabitsByDate = async (req, res) => {
  if (!req.user) throw unauthorized();

  // 1) Get date from query
  const dateString = req.query.date;
  const selectedDate = dateString
    ? dayjs(dateString, 'YYYY-MM-DD', true)
    : dayjs();

  if (dateString && !selectedDate.isValid())
    throw new AppError(
      'Invalid date format',
      400,
      ERROR_CODES.VALIDATION_ERROR,
      'date'
    );

  const startOfDay = selectedDate.startOf('day').toDate();
  const endOfDay = selectedDate.endOf('day').toDate();

  // 2) Fetch habits
  const habits = await HabitModel.find({
    userId: req.user._id,
    isDeleted: false,
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
  if (!req.user) throw unauthorized();

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
    clientId: uuidv4(),
    startDate: new Date(),
  });

  res.status(201).json({
    success: true,
    data: habit,
  });
};

export const updateHabit = async (req, res) => {
  if (!req.user) throw unauthorized();

  if (Object.keys(req.body).length === 0) throw noFieldsProvidedForUpdate();

  const allowedFieldsToUpdate = {
    title: true,
    description: true,
    frequency: true,
    categoryId: true,
  };

  const updateQuery = {};

  for (let key of Object.keys(req.body)) {
    if (key in allowedFieldsToUpdate) updateQuery[key] = req.body[key];
  }

  if (updateQuery?.categoryId) {
    const doesCategoryExist = await CategoryModel.doesCategoryExist(
      req.body.categoryId,
      req.user._id
    );
    if (!doesCategoryExist) throw notFound('Category');
  }

  const updatedHabit = await HabitModel.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    { $set: updateQuery },
    { new: true, runValidators: true }
  );

  if (!updatedHabit) throw notFound('Habit');

  res.status(200).json({
    success: true,
    data: updatedHabit,
  });
};

export const deleteHabit = async (req, res) => {
  if (!req.user) throw unauthorized();

  const habit = await HabitModel.findById(req.params.id);
  if (!habit) throw notFound('Habit');

  if (!habit.isOwner(req.user._id))
    throw new AppError(
      'You are not allowed to delete this habit',
      403,
      ERROR_CODES.FORBIDDEN
    );

  if (habit.isDeleted)
    throw new AppError(
      'Habit is already deleted',
      400,
      ERROR_CODES.RESOURCE_ALREADY_REMOVED
    );

  habit.isDeleted = true;
  await habit.save();

  res.status(200).json({
    success: true,
    message: 'habit deleted successfully',
  });
};

export const reorderHabits = async (req, res) => {
  if (!req.user) throw unauthorized();

  const { habits } = req.body;

  if (!habits)
    throw new AppError(
      'No habits provided',
      400,
      ERROR_CODES.NO_FIELDS_PROVIDED
    );

  const habitIds = habits.map((h) => h._id);

  const userHabits = await HabitModel.find({
    _id: { $in: habitIds },
    userId: req.user._id,
  }).select('_id');

  if (userHabits.length !== habits.length)
    throw new AppError(
      'Not allowed to modify these habits',
      403,
      ERROR_CODES.FORBIDDEN
    );

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
  if (!req.user) throw unauthorized();

  const { date } = req.body;

  const selectedDate = DateHelper.validateDateRange(date);

  const habit = await HabitModel.findById(req.params.id);

  if (!habit) throw notFound('Habit');

  // Validate habit ownership
  if (!habit.isOwner(req.user._id))
    throw new AppError(
      'Not allowed to modify this habit',
      403,
      ERROR_CODES.FORBIDDEN
    );

  if (habit.isDeleted)
    throw new AppError(
      'Habit is already deleted',
      400,
      ERROR_CODES.RESOURCE_ALREADY_REMOVED
    );

  //Check if date is before habit created date
  const createdAt = dayjs(habit.createdAt).startOf('day');
  if (selectedDate.isBefore(createdAt, 'day'))
    throw new AppError(
      'You cannot modify habits before their creation date',
      400,
      ERROR_CODES.VALIDATION_ERROR
    );

  //Validate if habit is completed for the same day
  if (
    await HabitCompletionModel.isAlreadyCompleted(req.params.id, selectedDate)
  )
    throw new AppError(
      'Habit is already completed',
      400,
      ERROR_CODES.ALREADY_COMPLETED
    );

  const habitCompletion = await HabitCompletionModel.create({
    habitId: habit._id,
    userId: req.user._id,
    date: selectedDate,
  });

  res.status(201).json({
    success: true,
    data: habitCompletion,
  });
};

// Unmark habit completion if exist, otherwise throw error
export const uncompleteHabit = async (req, res) => {
  if (!req.user) throw unauthorized();

  const { date } = req.body;

  const selectedDate = DateHelper.validateDateRange(date);

  const habit = await HabitModel.findById(req.params.id);

  if (!habit) throw notFound('Habit');

  // Validate habit ownership
  if (!habit.isOwner(req.user._id))
    throw new AppError(
      'Not allowed to modify this habit',
      403,
      ERROR_CODES.FORBIDDEN
    );

  if (habit.isDeleted)
    throw new AppError(
      'Habit is already deleted',
      400,
      ERROR_CODES.RESOURCE_ALREADY_REMOVED
    );

  const createdAt = dayjs(habit.createdAt).startOf('day');
  //Check if date is before habit created date
  if (selectedDate.isBefore(createdAt, 'day'))
    throw new AppError(
      'You cannot modify habits before their creation date',
      400,
      ERROR_CODES.VALIDATION_ERROR
    );

  const habitCompletion = await HabitCompletionModel.findOneAndDelete({
    habitId: habit._id,
    date: selectedDate,
  });

  if (!habitCompletion) throw notFound('HabitCompletion');

  res.status(200).json({
    success: true,
    data: habitCompletion,
  });
};
