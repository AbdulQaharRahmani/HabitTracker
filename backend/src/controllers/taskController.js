import { TaskModel } from '../models/Task.js';
import { AppError } from '../utils/error.js';

export const createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title || !description)
    throw new AppError('Please add title or description', 400);

  const task = await TaskModel.create({
    title,
    description,
    priority,
    dueDate,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
};
