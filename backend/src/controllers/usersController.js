import fs from 'fs';
import path from 'path';
import { AppError, notFound } from '../utils/error.js';
import { UserModel } from '../models/User.js';

//  Upload or update user's profile picture
export const uploadProfilePicture = async (req, res) => {
  if (!req.user) throw new AppError('User is not authorized.', 401);
  if (!req.file) throw new AppError('Please upload a profile image', 400);

  const user = await UserModel.findById(req.user._id);
  if (!user) throw notFound('User');

  // Delete previous profile picture if exists
  if (user.profilePicture) {
    const oldPath = path.join(
      process.cwd(),
      'src/uploads/profile',
      path.basename(user.profilePicture)
    );
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }
  // console.log(process.cwd()); => D:\HabitTracker\backend

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
