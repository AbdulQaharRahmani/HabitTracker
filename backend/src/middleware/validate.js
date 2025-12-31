import { validationResult } from 'express-validator';
import { AppError } from '../utils/error.js';

export const validate = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    throw new AppError(error.array()[0].msg, 400);
  }
  next();
};
