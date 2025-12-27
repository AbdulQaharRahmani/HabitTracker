import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.js';
import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/HabitCompletion.js';
dotenv.config();

await connectDB();

if (process.env.NODE_ENV !== 'development') {
  console.log('Seeder is only available in development mode!');
  process.exit();
}

const seed = async () => {
  await mongoose.connection.dropDatabase();
  console.log('Database cleared');

  const user = await UserModel.create({
    email: 'test@gmail.com',
    password: 'test123',
  });

  const habits = [
    {
      title: 'Study DSA',
      description: 'Improve my logic',
      frequency: 'daily',
      userId: user._id,
      order: 1,
    },
    {
      title: 'Play Football',
      description: 'Improve my skills',
      frequency: 'weekly',
      userId: user._id,
      order: 2,
    },
    {
      title: 'Study Book of Proof',
      description: 'Improve my logic',
      frequency: 'every-other-day',
      userId: user._id,
      order: 3,
    },
  ];

  const result = await HabitModel.insertMany(habits);

  let habitCompletions = [];

  for (let habit of result) {
    habitCompletions.push({ habitId: habit._id, userId: habit.userId });
  }

  await HabitCompletionModel.insertMany(habitCompletions);

  console.log('Seed data completed');
  process.exit();
};

try {
  seed();
} catch (error) {
  console.log(error.message);
  process.exit();
}
