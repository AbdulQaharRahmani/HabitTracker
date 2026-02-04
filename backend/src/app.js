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
import { logMiddleware } from './middleware/logger.js';

const app = express();

//#region Normal Midlleware

app.use(express.json());

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://habittracker-kwpt.onrender.com'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(logMiddleware);
//#endregion

//#region Route Middlewares

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')));

app.get('/api/health', (req, res) => {
  res.send('Habit tracker API is running');
});

// Public routes

app.use('/api/auth', authRoutes);

// Protect routes

app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/habits', authMiddleware, habitRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/logs', authMiddleware, logRoutes);
app.use('/api/offline-data', authMiddleware, syncRoutes);

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
