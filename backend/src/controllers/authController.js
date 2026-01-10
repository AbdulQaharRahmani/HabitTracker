import { AppError } from '../utils/error.js';
import { UserModel } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const emailExisted = await UserModel.exists({ email });
  if (emailExisted) {
    throw new AppError('Email already exists', 400);
  }

  const hashPassword = await bcrypt.hash(password, 12);

  await UserModel.create({
    username,
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
      username: user.username,
    },
  });
};
