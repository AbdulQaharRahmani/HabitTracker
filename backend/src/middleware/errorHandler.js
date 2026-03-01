import { ERROR_CODES } from '../utils/constant.js';
const VALIDATION_ERROR = 'ValidationError';

export const errorHandler = (err, req, res, next) => {
  console.warn(err);

  res.locals.errorData = {
    message: err.message,
    stack: err.stack ? err.stack.split('\n').slice(0, 4).join('\n') : undefined,
  };

  if (err.isOperational) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      field: err.field,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      code: ERROR_CODES.INVALID_JWT,
      message: 'Invalid or expired token',
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      code: ERROR_CODES.DUPLICATE,
      message: 'Duplicate value detected',
    });
  }

  if (err.name === VALIDATION_ERROR) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({
    code: ERROR_CODES.SERVER_ERROR,
    message: 'Server error',
  });
};
