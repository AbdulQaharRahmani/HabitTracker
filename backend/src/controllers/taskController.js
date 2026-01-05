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

export const toggleTaskStatus = async (req, res) => {
  if (!req.user) throw new AppError('User is not authenticated', 401);

  const taskId = req.params.id;

  const task = await TaskModel.findOne({
    _id: taskId,
    userId: req.user._id,
  });

  if (!task) throw notFound('Task');

  // toggle task status todo <=> done
  task.status = task.status === 'todo' ? 'done' : 'todo';

  await task.save();

  res.status(200).json({ success: true, data: task });
};
