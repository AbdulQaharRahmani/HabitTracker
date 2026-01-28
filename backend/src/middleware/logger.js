import logger from '../utils/logger.js';

export const logMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.originalUrl.split('?')[0],
      statusCode: res.statusCode,
      duration: duration,
      userId: req.user?._id.toString(),
      clientIp:
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request client error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
};
