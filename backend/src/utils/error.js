import { ERROR_CODES } from './constant.js';
// Custom AppError class that can be used to throw errors in controller
// Usage => throw new AppError(errorMessage,statusCode)
export class AppError extends Error {
  constructor(message, status = 400, code, field) {
    super(message);
    this.status = status;
    this.code = code;
    this.field = field;
    this.isOperational = true;
  }
}

// Used to throw error when a resource is not found(Ex: habit not found)
export const notFound = (resource = 'Resource') =>
  new AppError(`${resource} not found`, 404, ERROR_CODES.NOT_FOUND, resource);

export const unauthorized = () =>
  new AppError('User is not authorized', 401, ERROR_CODES.UNAUTHORIZED);

export const noFieldsProvidedForUpdate = () =>
  new AppError(
    'No fields provided for update',
    400,
    ERROR_CODES.NO_FIELDS_PROVIDED
  );
