import { TaskModel } from '../models/Task.js';
import { AppError } from '../utils/error.js';

export const createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title || !description)
    throw new AppError('Please Provide title and description', 400);

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
