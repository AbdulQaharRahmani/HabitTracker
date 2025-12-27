// Custom AppError class that can be used to throw errors in controller
// Usage => throw new AppError(errorMessage,statusCode)
export class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

// Used to throw error when a resource is not found(Ex: habit not found)
export const notFound = (resource = 'Resource') =>
  new AppError(`${resource} not found`, 404);
