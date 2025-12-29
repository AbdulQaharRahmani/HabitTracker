import jwt from 'jsonwebtoken';
import { AppError } from '../utils/error.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { UserModel } from '../models/User.js';

export const authenticationToken = asyncHandler(async (req, res, next) => {
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

  req.user = {
    _id: user._id,
    email: user.email,
  };
  next();
});
