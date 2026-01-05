import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { deleteFile } from '../utils/deleteFile.js';
import { AppError, notFound } from '../utils/error.js';

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
