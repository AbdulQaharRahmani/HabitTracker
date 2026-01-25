import logger from '../utils/logger.js';
import { createLog } from '../controllers/logController.js';

export const logMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?._id.toString(),
      clientIp:
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
    };

    if (res.statusCode >= 500) {
      logger.error('Request failed', logData);
      await createLog({
        level: 'error',
        message: 'Request failed',
        metadata: logData,
      });
    } else if (res.statusCode >= 400) {
      logger.warn('Request client error', logData);
      await createLog({
        level: 'warn',
        message: 'Request client error',
        metadata: logData,
      });
    } else {
      logger.info('Request completed', logData);
      await createLog({
        level: 'info',
        message: 'Request completed',
        metadata: logData,
      });
    }
  });

  next();
};
