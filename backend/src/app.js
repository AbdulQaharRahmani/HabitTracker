import express from 'express';
import cors from 'cors';
import habitRouter from './routes/habitRoutes.js';

const app = express();

app.use(express.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('Habit tracker API is running');
});

app.use('/habits', habitRouter);

export default app;
