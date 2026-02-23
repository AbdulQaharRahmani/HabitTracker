import { ERROR_CODES } from '../utils/constant.js';
import { AppError } from '../utils/error.js';

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Forbidden: You don't have permission to access this resource",
          403,
          ERROR_CODES.FORBIDDEN
        )
      );
    }
    next();
  };
};
