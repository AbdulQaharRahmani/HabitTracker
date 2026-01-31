import express from 'express';
import cors from 'cors';
import path from 'path';
import habitRoutes from './routes/habits.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import taskRoutes from './routes/task.js';
import categoryRoutes from './routes/categories.js';
import syncRoutes from './routes/sync.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from '@exortek/express-mongo-sanitize';

const app = express();

//#region Normal Midlleware

app.use(helmet());

app.use(express.json());
app.use(cors({ origin: '*' }));

const limiter = rateLimit({
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : req.ip;
  },
  windowMs: 15 * 60 * 1000,
  limit: (req) => (req.user ? 100 : 50),
  message: 'Too many requests, please try again later.',
});

app.use(mongoSanitize());

//#endregion

//#region Route Middlewares

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

app.get('/api/health', (req, res) => {
  res.send('Habit tracker API is running');
});

// Public routes

app.use('/api/auth', limiter, authRoutes);

// Protect routes

app.use('/api/categories', authMiddleware, limiter, categoryRoutes);
app.use('/api/habits', authMiddleware, limiter, habitRoutes);
app.use('/api/tasks', authMiddleware, limiter, taskRoutes);
app.use('/api/users', authMiddleware, limiter, userRoutes);
app.use('/api/offline-data', authMiddleware, limiter, syncRoutes);

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
