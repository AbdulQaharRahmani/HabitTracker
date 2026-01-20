import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = new Date();

  res.on('finish', () => {
    logger.info('Request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: new Date() - start,
      userId: req.user?._id,
    });
  });

  next();
};

export const errorLogger = (err, req, res, next) => {
  logger.error('error', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    stack: err.stack,
  });

  next();
};
