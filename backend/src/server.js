import app from './app.js';
import { configDotenv } from 'dotenv';
import { connectDB } from './config/database.js';

configDotenv();
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
