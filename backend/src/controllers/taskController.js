import { TaskModel } from '../models/Task.js';
import { DateHelper } from '../utils/date.js';
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

  const { searchTerm, status, priority, dueDate } = req.query;

  let query = { userId: req.user._id };

  if (searchTerm)
    query.$or = [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ];

  if (status) query.status = status;

  if (priority) query.priority = priority;

  if (dueDate) {
    const date = new Date(dueDate);
    query.dueDate = {
      $gte: DateHelper.getStartOfDate(date),
      $lte: DateHelper.getEndOfDate(date),
    };
  }

  const tasks = await TaskModel.find({ ...query }).lean();

  res.status(200).json({ success: true, data: tasks });
};
