import { TaskModel } from '../models/Task.js';
import { DateHelper } from '../utils/date.js';
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
