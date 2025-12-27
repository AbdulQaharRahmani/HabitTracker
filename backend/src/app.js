import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('Habit tracker API is running');
});

export default app;

