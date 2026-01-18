import { CategoryModel } from '../models/Category.js';
import { HabitModel } from '../models/Habit.js';
import { ERROR_CODES } from '../utils/constant.js';
import {
  AppError,
  noFieldsProvidedForUpdate,
  notFound,
  unauthorized,
} from '../utils/error.js';

export const createCategory = async (req, res) => {
  if (!req.user) throw unauthorized();

  const { name, icon, backgroundColor } = req.body;

  const category = await CategoryModel.create({
    userId: req.user._id,
    name,
    icon,
    backgroundColor,
  });

  res.status(201).json({ success: true, data: category });
};

export const updateCategory = async (req, res) => {
  if (!req.user) throw unauthorized();

  if (Object.keys(req.body).length === 0) throw noFieldsProvidedForUpdate();

  const allowedFieldsToUpdate = {
    name: true,
    icon: true,
    backgroundColor: true,
  };

  const updateQuery = {};

  for (let key of Object.keys(req.body)) {
    if (key in allowedFieldsToUpdate) updateQuery[key] = req.body[key];
  }

  const category = await CategoryModel.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    { $set: updateQuery },
    { new: true, runValidators: true }
  );

  if (!category) throw notFound('Category');

  res.status(200).json({ success: true, data: category });
};

export const deleteCategory = async (req, res) => {
  if (!req.user) throw unauthorized();

  const isCategoryInUsed = await HabitModel.exists({
    categoryId: req.params.id,
  });

  if (isCategoryInUsed)
    throw new AppError(
      'Category is in-used',
      400,
      ERROR_CODES.RESOURCE_IN_USED,
      'Category'
    );

  const category = await CategoryModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!category) throw notFound('Category');

  res.status(200).json({ success: true, data: category });
};

export const getCategories = async (req, res) => {
  if (!req.user) throw unauthorized();

  const categories = await CategoryModel.find({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: categories,
  });
};
