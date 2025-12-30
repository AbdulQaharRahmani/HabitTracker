import express from 'express';
import cors from 'cors';
import habitsRoutes from './routes/habits.js';
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/categories.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

//#region Normal Midlleware

app.use(express.json());
app.use(cors({ origin: '*' }));

//#endregion

//#region Route Middlewares

app.get('/api/health', (req, res) => {
  res.send('Habit tracker API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/categories', categoryRoutes);
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
