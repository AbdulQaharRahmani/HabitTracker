import { TaskModel } from '../models/Task.js';
import { ERROR_CODES } from '../utils/constant.js';
import { DateHelper } from '../utils/date.js';
import { CategoryModel } from '../models/Category.js';
import {
  AppError,
  noFieldsProvidedForUpdate,
  notFound,
  unauthorized,
} from '../utils/error.js';
import { v4 as uuidv4 } from 'uuid';

export const createTask = async (req, res) => {
  if (!req.user) throw unauthorized();

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
    clientId: uuidv4(),
    categoryId,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
};

// Get task lists with pagination
export const getTasks = async (req, res) => {
  if (!req.user) throw unauthorized();

  const limit = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  const tasksTotal = await TaskModel.countDocuments({
    userId: req.user._id,
    isDeleted: false,
  });

  const totalPages = Math.ceil(tasksTotal / limit);

  const tasks = await TaskModel.find({ userId: req.user._id, isDeleted: false })
    .sort({ createdAt: -1 }) // Sort from latest to oldest
    .skip(skip)
    .limit(limit)
    .populate('categoryId', 'name icon backgroundColor');

  res.status(200).json({
    success: true,
    totalPages,
    data: tasks,
  });
};

export const deleteTask = async (req, res) => {
  if (!req.user) throw unauthorized();

  const task = await TaskModel.findById(req.params.id);
  if (!task) throw notFound('Task');

  //Ensure the task belongs to the authenticated user
  if (String(req.user._id) !== String(task.userId))
    throw new AppError(
      'You are not allowed to remove this task',
      403,
      ERROR_CODES.FORBIDDEN
    );

  //Check task already deleted
  if (task.isDeleted)
    throw new AppError(
      'Task already deleted',
      400,
      ERROR_CODES.RESOURCE_ALREADY_REMOVED
    );

  task.deletedAt = new Date();
  task.isDeleted = true;

  await task.save();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
  });
};

export const filterTasks = async (req, res) => {
  if (!req.user) throw unauthorized();

  const { searchTerm, status, priority, dueDate } = req.query;

  let query = { userId: req.user._id, isDeleted: false };

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

  const tasks = await TaskModel.find({ ...query })
    .populate('categoryId', 'name icon backgroundColor')
    .lean();

  res.status(200).json({ success: true, data: tasks });
};

export const toggleTaskStatus = async (req, res) => {
  if (!req.user) throw unauthorized();

  const taskId = req.params.id;

  const task = await TaskModel.findOne({
    _id: taskId,
    userId: req.user._id,
    isDeleted: false,
  });

  if (!task) throw notFound('Task');

  // toggle task status todo <=> done
  task.status = task.status === 'todo' ? 'done' : 'todo';

  await task.save();

  res.status(200).json({ success: true, data: task });
};

export const updateTask = async (req, res) => {
  if (!req.user) unauthorized();

  if (Object.keys(req.body).length === 0) throw noFieldsProvidedForUpdate();

  const allowedFieldsToUpdate = {
    title: true,
    description: true,
    status: true,
    priority: true,
    dueDate: true,
    categoryId: true,
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
    { _id: req.params.id, userId: req.user._id, isDeleted: false },
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
