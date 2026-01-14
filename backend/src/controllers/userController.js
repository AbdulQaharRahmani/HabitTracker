import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { deleteFile } from '../utils/deleteFile.js';
import { AppError, notFound } from '../utils/error.js';
import { PreferenceModel } from '../models/Preference.js';
import { DateHelper } from '../utils/date.js';

//  Upload or update user's profile picture
export const uploadProfilePicture = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);
  if (!req.file) throw new AppError('Please upload a profile image', 400);

  const user = await UserModel.findById(req.user._id);
  if (!user) throw notFound('User');

  // Delete previous profile picture if exists
  if (user.profilePicture) {
    deleteFile(user.profilePicture);
  }

  user.profilePicture = `/uploads/profile/${req.file.filename}`;
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Your profile picture uploaded',
  });
};

//  Get user's profile picture
export const getProfilePicture = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) throw notFound('User');

  if (!user.profilePicture)
    return res.status(200).json({
      success: true,
      message: 'User does not have profile picture',
    });

  const fullUrl = `${req.protocol}://${req.get('host')}${user.profilePicture}`;
  // console.log(req.protocol, req.get('host')); ==> http, localhost:3000

  res.status(200).json({
    success: true,
    data: fullUrl,
  });
};

export const changePassword = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { oldPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.user._id);

  if (!user) throw notFound('User');

  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isPasswordMatch) throw new AppError('Password is wrong', 400);

  const isPasswordSame = await bcrypt.compare(newPassword, user.password);

  if (isPasswordSame)
    throw new AppError(
      'New password cannot be the same as the current password',
      400
    );

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;
  user.changedPasswordAt = new Date();

  await user.save();

  res
    .status(200)
    .json({ success: true, message: 'Password changed successfully' });
};

export const updateUsername = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);

  const { username } = req.body;

  // check if username already exists for another user
  const existingUser = await UserModel.findOne({ username });

  if (existingUser && existingUser._id.toString() !== req.user._id.toString())
    throw new AppError('User already exist with same username', 409);

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { username },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) throw notFound('User');

  res.status(200).json({
    success: true,
    message: 'Username updated successfully',
  });
};

export const getUserPreference = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  let userPreference = await PreferenceModel.findOne({ userId: req.user._id });
  if (!userPreference)
    userPreference = await PreferenceModel.create({ userId: req.user._id });

  res.status(200).json({ success: true, data: userPreference });
};

export const updateUserPreference = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized', 401);

  if (Object.keys(req.body).length === 0)
    throw new AppError('No fields provide for update', 400);

  const allowedFieldsToUpdate = {
    weekStartDay: true,
    dailyReminderTime: true,
    dailyReminderEnabled: true,
    timezone: true,
    streakAlertEnabled: true,
    weeklySummaryEmailEnabled: true,
    theme: true,
  };

  const updateQuery = {};

  for (let key of Object.keys(req.body)) {
    if (key in allowedFieldsToUpdate) updateQuery[key] = req.body[key];
  }

  if (updateQuery.timezone) {
    updateQuery.timezone = DateHelper.TIMEZONES[updateQuery.timezone];
  }

  const updatedPreference = await PreferenceModel.findOneAndUpdate(
    { userId: req.user._id },
    { $set: updateQuery, $setOnInsert: { userId: req.user._id } },
    { new: true, runValidators: true, upsert: true }
  );

  res.status(200).json({ success: true, data: updatedPreference });
};
