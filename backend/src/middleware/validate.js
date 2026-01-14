import { validationResult } from 'express-validator';
import { AppError } from '../utils/error.js';
import { ERROR_CODES } from '../utils/constant.js';

export const validate = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = error.array()[0];
    throw new AppError(err.msg, 400, ERROR_CODES.VALIDATION_ERROR, err.path);
  }
  next();
};
