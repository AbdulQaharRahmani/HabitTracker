import { TaskModel } from '../models/Task.js';
import { AppError, notFound } from '../utils/error.js';

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

export const deleteTask = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  const task = await TaskModel.findById(req.params.id);
  if (!task) throw notFound('Task');

  //Ensure the task belongs to the authenticated user
  if (String(req.user._id) !== String(task.userId))
    throw new AppError('You are not allowed to remove this task', 403);

  task.isDeleted = true;

  await task.save();
  
  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
};
