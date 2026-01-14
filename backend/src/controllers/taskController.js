import { TaskModel } from '../models/Task.js';
import { DateHelper } from '../utils/date.js';
import { AppError, notFound } from '../utils/error.js';
import { CategoryModel } from '../models/Category.js';

export const createTask = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { title, description, priority, dueDate, categoryId } = req.body;

  const doesCategoryExist = await CategoryModel.doesCategoryExist(
    categoryId,
    req.user._id
  );

  if (!doesCategoryExist) throw notFound('Category');

  const task = await TaskModel.create({
    title,
    description,
    priority,
    dueDate,
    userId: req.user._id,
    categoryId,
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

export const deleteTask = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  const task = await TaskModel.findById(req.params.id);
  if (!task) throw notFound('Task');

  //Ensure the task belongs to the authenticated user
  if (String(req.user._id) !== String(task.userId))
    throw new AppError('You are not allowed to remove this task', 403);

  //Check task already deleted
  if (task.isDeleted) throw new AppError('Task already deleted', 400);

  task.deletedAt = new Date();
  task.isDeleted = true;

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
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

  if (Object.keys(req.body).length === 0)
    throw new AppError('No fields provided for update', 400);

  const allowedFieldsToUpdate = {
    title: true,
    description: true,
    status: true,
    priority: true,
    dueDate: true,
    categoryId: true
  };

  const updateQuery = {};

  for (let key of Object.keys(req.body)) {
    if (key in allowedFieldsToUpdate) updateQuery[key] = req.body[key];
  }

  if (updateQuery?.categoryId) {
    const doesCategoryExist = await CategoryModel.doesCategoryExist(
      req.body.categoryId,
      req.user._id
    );
    if (!doesCategoryExist) throw notFound('Category');
  }
  
  const task = await TaskModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: updateQuery },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) throw notFound('Task');

  res.status(200).json({
    success: true,
    data: task,
  });
};
