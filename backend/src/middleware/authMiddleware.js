import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { UserModel } from '../models/User.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new AppError('Unauthorized: Token missing ', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.id) {
    throw new AppError('Unauthorized: Invalid token payload', 401);
  }

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new AppError('Unauthorized: User not found', 401);
  }

  const issueAt = decoded.iat * 1000; // convert iat from seconds to milliseconds
  const changedPasswordAt = user.changedPasswordAt?.getTime(); // get the changedPasswordAt in milliseconds

  if (user.changedPasswordAt && issueAt < changedPasswordAt)
    throw new AppError('Password has been changed.Please log in again.');

  req.user = {
    _id: user._id,
    email: user.email,
  };
  next();
});
