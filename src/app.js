import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Habit tracker API is running');
});

export default app;
