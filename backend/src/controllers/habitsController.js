import { AppError, notFound } from '../../utils/error.js';
import { HabitModel } from '../models/Habit.js';

export const getHabits = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const habits = await HabitModel.find({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: habits,
  });
};

export const createHabit = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { title, description, frequency } = req.body;

  const habit = await HabitModel.create({
    userId: req.user._id,
    title,
    description,
    frequency,
  });

  res.status(201).json(habit);
};

export const updateHabit = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const habit = await HabitModel.findById(req.params.id);
  if (!habit) throw notFound('Habit');

  if (!habit.isOwner(req.user._id))
    throw new AppError('You are not allowed to update this habit', 403);

  const { title, description, frequency } = req.body;

  if (title !== undefined) habit.title = title;
  if (description !== undefined) habit.description = description;
  if (frequency !== undefined) habit.frequency = frequency;

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

  await habit.deleteOne();

  res.status(200).json({
    success: true,
    message: 'habit deleted successfully',
  });
};
