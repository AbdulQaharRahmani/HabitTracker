import { CategoryModel } from '../models/CategoryModel.js';
import { AppError, notFound } from '../utils/error.js';

export const createCategory = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

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
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { name, icon, backgroundColor } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    { name, icon, backgroundColor },
    { new: true, runValidators: true }
  );

  if (!category) throw notFound('Category');

  res.status(200).json({ success: true, data: category });
};

export const deleteCategory = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const category = await CategoryModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!category) throw notFound('Category');

  res.status(200).json({ success: true, data: category });
};
