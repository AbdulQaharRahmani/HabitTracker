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

export const filterTasks = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  const { searchTerm, status, priority, dueDate, deletedAt } = req.query;

  let query = { userId: req.user._id };

  if (searchTerm)
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ];

  if (status) query.status = status;

  if (priority) query.priority = priority;

  if (dueDate) query.dueDate = new Date(dueDate);

  if (deletedAt) query.deletedAt = new Date(deletedAt);

  const tasks = await TaskModel.find({ ...query }).lean();

  res.status(200).json({ success: true, data: tasks });
};
