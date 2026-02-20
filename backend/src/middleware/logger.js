import { sanitizeSensitiveData } from '../utils/log.js';
import logger from '../utils/logger.js';
import { randomUUID } from 'crypto';

export const logMiddleware = (req, res, next) => {
  const start = Date.now();

  // Save the original res.json function so we can call it later
  const originalJson = res.json.bind(res);

  // Initialize a place to store the response body for logging
  // res.locals is a temporary place that we can store date there
  res.locals.responseBody = undefined;

  // Override res.json to save a copy of the response before send it
  res.json = (body) => {
    res.locals.responseBody = body; // store the body for logging
    return originalJson(body); // call the original res.json to actually send the response
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      logId: randomUUID(),
      method: req.method,
      path: req.originalUrl.split('?')[0],
      statusCode: res.statusCode,
      duration: duration,
      userId: req.user?._id?.toString(),
      clientIp:
        req.ip === '::1'
          ? '127.0.0.1'
          : req.ip ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],

      request: {
        headers: sanitizeSensitiveData(req.headers),
        query: sanitizeSensitiveData(req.query),
        params: sanitizeSensitiveData(req.params),
        body: sanitizeSensitiveData(req.body),
      },

      response: {
        headers: sanitizeSensitiveData(res.getHeaders()),
        body: sanitizeSensitiveData(res.locals.responseBody),
      },

      error: res.locals.errorData || null,
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
