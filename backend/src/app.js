import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import habitRoutes from './routes/habits.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import taskRoutes from './routes/task.js';
import logRoutes from './routes/log.js';
import categoryRoutes from './routes/categories.js';
import syncRoutes from './routes/sync.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import helmet from 'helmet';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { logMiddleware } from './middleware/logger.js';
import { sanitizeKeys } from './middleware/sanitizer.js';
import { authorizeRoles } from './middleware/authorizeRoles.js';

const app = express();

//#region Normal Midlleware

app.use(express.json());

const limiter = rateLimit({
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : ipKeyGenerator(req);
  },
  windowMs: 15 * 60 * 1000,
  limit: (req) => (req.user ? 100 : 50),
  message: 'Too many requests, please try again later.',
});

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://habittracker-kwpt.onrender.com'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use((req, res, next) => {
  req.body = sanitizeKeys(req.body);
  req.params = sanitizeKeys(req.params);
  next();
});
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(logMiddleware);
//#endregion

//#region Route Middlewares

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

app.get('/api/health', (req, res) => {
  res.send('Habit tracker API is running');
});

// Public routes

app.use('/api/auth', limiter, authRoutes);

// Protect routes

// Role: Admin & User
app.use(
  '/api/categories',
  authMiddleware,
  authorizeRoles('admin', 'user'),
  limiter,
  categoryRoutes
);
app.use(
  '/api/habits',
  authMiddleware,
  authorizeRoles('admin', 'user'),
  limiter,
  habitRoutes
);
app.use(
  '/api/tasks',
  authMiddleware,
  authorizeRoles('admin', 'user'),
  limiter,
  taskRoutes
);
app.use(
  '/api/users',
  authMiddleware,
  authorizeRoles('admin', 'user'),
  limiter,
  userRoutes
);
app.use(
  '/api/offline-data',
  authMiddleware,
  authorizeRoles('admin', 'user'),
  limiter,
  syncRoutes
);

// Role: Admin
app.use(
  '/api/logs',
  authMiddleware,
  authorizeRoles('admin'),
  limiter,
  logRoutes
);

//#endregion

//#region Not found (404) middleware

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

//#endregion

//#region Error Handler middleware

app.use(errorHandler);

//#endregion

export default app;
