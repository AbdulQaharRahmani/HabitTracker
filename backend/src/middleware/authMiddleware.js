import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { UserModel } from '../models/User.js';
import { ERROR_CODES } from '../utils/constant.js';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new AppError(
      'Unauthorized: Token missing ',
      401,
      ERROR_CODES.INVALID_JWT
    );
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded.id) {
    throw new AppError(
      'Unauthorized: Invalid token payload',
      401,
      ERROR_CODES.INVALID_JWT
    );
  }

  const user = await UserModel.findById(decoded.id);
  if (!user) {
    throw new AppError(
      'Unauthorized: User not found',
      401,
      ERROR_CODES.INVALID_JWT
    );
  }

  const issueAt = decoded.iat * 1000; // convert iat from seconds to milliseconds
  const changedPasswordAt = user.changedPasswordAt?.getTime(); // get the changedPasswordAt in milliseconds

  if (user.changedPasswordAt && issueAt < changedPasswordAt)
    throw new AppError(
      'Password has been changed.Please log in again.',
      401,
      ERROR_CODES.INVALID_JWT
    );

  req.user = {
    _id: user._id,
    email: user.email,
  };
  next();
});
