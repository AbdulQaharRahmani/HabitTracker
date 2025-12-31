import { AppError, notFound } from '../utils/error.js';
import { UserModel } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const emailExisted = await UserModel.exists({ email });
  if (emailExisted) {
    throw new AppError('Email exists already', 400);
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const user = await UserModel.create({
    email,
    password: hashPassword,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new AppError('User not existed!', 404);
  }

  const pswMatch = await bcrypt.compare(password, user.password);
  if (!pswMatch) {
    throw new AppError('Password is not correct', 400);
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res.status(200).json({
    success: true,
    message: 'Login Successfully',
    data: {
      token,
      id: user._id,
      email: user.email,
    },
  });
};

// @desc    Upload or update user's profile picture
// @route   POST /api/users/profile-picture
// @access  Private
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

  user.profilePicture = `/uploads/profile/${req.file.filename}`;
  await user.save();

  res.status(201).json({
    success: true,
    message: 'User profile picture updated',
  });
};

// @desc    Get user's profile picture
// @route   GET /api/users/:id/profile-picture
// @access  Public
export const getProfilePicture = async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) throw notFound('User');

  if (!user.profilePicture)
    return res.status(200).json({
      success: true,
      message: 'User does not have profile picture',
    });

  res.sendFile(
    path.join(
      process.cwd(),
      '/src/uploads/profile',
      path.basename(user.profilePicture)
    )
  );
};
