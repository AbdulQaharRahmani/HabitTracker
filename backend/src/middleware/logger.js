import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info('Request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?._id,
      clientIp:
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress,
      userAgent: req.headers['user-agent'], // tools (browser)
      requestSize: req.headers['content-length'] || 0,
    });
  });

  next();
};

export const errorLogger = (err, req, res, next) => {
  logger.error('Request error:', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    stack: err.stack, // error full path
  });

  next(err);
};
