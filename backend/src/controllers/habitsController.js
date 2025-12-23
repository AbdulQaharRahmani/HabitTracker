import { AppError } from '../../utils/error.js';
import { HabitModel } from '../models/Habit.js';

export const getHabits = async (req, res) => {
  if (!req.user) {
    throw new AppError('User is not authorized.', 401);
  }

  const habits = await HabitModel.findByUserAndSortByOrder(req.user._id);

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
  let habitCount = await HabitModel.getHabitCountByUserId(req.user._id);

  const habit = await HabitModel.create({
    userId: req.user._id,
    title,
    description,
    frequency,
    order: habitCount + 1,
  });

  res.status(201).json({
    success: true,
    data: habit,
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
