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

export const updateTask = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  const task = await TaskModel.findById(req.params.id);
  if (!task) throw notFound('Task');

  //Ensure the task belongs to the authenticated user
  if (String(req.user._id) !== String(task.userId))
    throw new AppError('You are not allowed to update this task', 403);

  const { title, description, status, priority, dueDate } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();
  res.status(200).json({
    success: true,
    data: task,
  });
};
