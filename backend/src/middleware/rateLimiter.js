import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const TIME_LIMIT = 15 * 60 * 1000;

// Rate limiter for public routes
export const publicLimiter = rateLimit({
  windowMs: TIME_LIMIT,
  max: 20,
  keyGenerator: (req) => {
    const ip = req.ip || ipKeyGenerator(req);
    console.log('Limiter IP:', ip); // log on render to check IP of unauthenticated users for security
    return ip;
  },
  message: 'Too many authentication attempts, try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for private routes
export const privateLimiter = rateLimit({
  windowMs: TIME_LIMIT,
  max: 1000,
  keyGenerator: (req) =>
    req.user ? req.user._id.toString() : ipKeyGenerator(req),
  message: 'Too many requests.',
  standardHeaders: true,
  legacyHeaders: false,
});
