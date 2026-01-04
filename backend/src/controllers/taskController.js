import { TaskModel } from '../models/Task.js';
import { AppError } from '../utils/error.js';

export const createTask = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { title, description, priority, dueDate } = req.body;

  const task = await TaskModel.create({
    title,
    description,
    priority,
    dueDate,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
};

// Get task lists with pagination
export const getTasks = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const limit = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const tasks = await TaskModel.find({ userId: req.user._id, deletedAt: null })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: tasks,
  });
};
