import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import dotenv from 'dotenv';
import { UserModel } from '../models/User.js';
import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/HabitCompletion.js';
import { CategoryModel } from '../models/Category.js';
import bcrypt from 'bcryptjs';
dotenv.config();

await connectDB();

if (process.env.NODE_ENV !== 'development') {
  console.log('Seeder is only available in development mode!');
  process.exit();
}

const SECONDS_IN_ONE_DAY = 86400000;

const createHabitCompletionData = (habits) => {
  const habitCompletions = [];

  for (let habit of habits) {
    switch (habit.frequency) {
      case 'daily': {
        let currentDate = new Date(habit.createdAt);
        for (let i = 1; i <= 5; i++) {
          currentDate = new Date(
            currentDate.getTime() + i * SECONDS_IN_ONE_DAY
          );
          habitCompletions.push({
            habitId: habit._id,
            userId: habit.userId,
            date: currentDate,
            createdAt: currentDate,
            updatedAt: currentDate,
          });
        }
        break;
      }
      case 'weekly': {
        let currentDate = new Date(habit.createdAt);
        for (let i = 1; i <= 4; i++) {
          currentDate = new Date(
            currentDate.getTime() + 7 * SECONDS_IN_ONE_DAY
          );
          habitCompletions.push({
            habitId: habit._id,
            userId: habit.userId,
            date: currentDate,
            createdAt: currentDate,
            updatedAt: currentDate,
          });
        }
        break;
      }
      case 'biweekly': {
        let currentDate = new Date(habit.createdAt);
        for (let i = 1; i <= 3; i++) {
          currentDate = new Date(
            currentDate.getTime() + 14 * SECONDS_IN_ONE_DAY
          );
          habitCompletions.push({
            habitId: habit._id,
            userId: habit.userId,
            date: currentDate,
            createdAt: currentDate,
            updatedAt: currentDate,
          });
        }
        break;
      }
      case 'every-other-day': {
        let currentDate = new Date(habit.createdAt);
        for (let i = 1; i <= 5; i++) {
          currentDate = new Date(
            currentDate.getTime() + 2 * SECONDS_IN_ONE_DAY
          );
          habitCompletions.push({
            habitId: habit._id,
            userId: habit.userId,
            date: currentDate,
            createdAt: currentDate,
            updatedAt: currentDate,
          });
        }
        break;
      }
    }
  }

  return habitCompletions;
};

const seed = async () => {
  await mongoose.connection.dropDatabase();
  console.log('Database cleared');

  const hashedPassword = await bcrypt.hash('test123', 12);

  const user = await UserModel.create({
    email: 'test@gmail.com',
    password: hashedPassword,
  });

  // Create Category Data
  const categories = await CategoryModel.insertMany([
    { name: 'Other', userId: user._id },
    { name: 'Health', userId: user._id },
    { name: 'Study', userId: user._id },
    { name: 'Work', userId: user._id },
  ]);

  const startDate = new Date();

  startDate.setMonth(startDate.getMonth() - 2);

  const habits = [
    {
      title: 'Study DSA',
      description: 'Improve my logic',
      frequency: 'daily',
      userId: user._id,
      order: 1,
      categoryId: categories[2]._id,
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
    },
    {
      title: 'Play Football',
      description: 'Improve my skills',
      frequency: 'weekly',
      userId: user._id,
      order: 2,
      categoryId: categories[1]._id,
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
    },
    {
      title: 'Study Book of Proof',
      description: 'Improve my logic',
      frequency: 'every-other-day',
      userId: user._id,
      order: 3,
      categoryId: categories[2]._id,
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
    },
    {
      title: 'Play Basketball',
      description: 'Fun',
      frequency: 'biweekly',
      userId: user._id,
      order: 4,
      categoryId: categories[1]._id,
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
    },
    {
      title: 'AI',
      description: 'Learn about AI',
      frequency: 'daily',
      userId: user._id,
      order: 5,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
    },
    {
      title: 'MongoDB',
      description: 'Learn about MongoDb',
      frequency: 'weekly',
      userId: user._id,
      order: 6,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
    },
    {
      title: 'Nodejs',
      description: 'Learn about Nodejs',
      frequency: 'daily',
      userId: user._id,
      order: 7,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate),
      updatedAt: new Date(startDate),
    },
    {
      title: 'React',
      description: 'Learn about React',
      frequency: 'daily',
      userId: user._id,
      order: 8,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Exercise',
      description: 'Morning workout',
      frequency: 'daily',
      userId: user._id,
      order: 9,
      categoryId: categories[1]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Read a book',
      description: 'Read at least 20 pages',
      frequency: 'every-other-day',
      userId: user._id,
      order: 10,
      categoryId: categories[2]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Meditation',
      description: '10 minutes',
      frequency: 'daily',
      userId: user._id,
      order: 11,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Clean home',
      description: 'Keep home clean',
      frequency: 'weekly',
      userId: user._id,
      order: 12,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Grocery shopping',
      description: 'Buy weekly groceries',
      frequency: 'weekly',
      userId: user._id,
      order: 13,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Call family',
      description: 'Have fun',
      frequency: 'biweekly',
      userId: user._id,
      order: 14,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Journal',
      description: 'Write daily stories',
      frequency: 'daily',
      userId: user._id,
      order: 15,
      categoryId: categories[0]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
    {
      title: 'Learn Spanish',
      description: 'Language practice',
      frequency: 'every-other-day',
      userId: user._id,
      order: 16,
      categoryId: categories[2]._id,
      createdAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
      updatedAt: new Date(startDate.getTime() + SECONDS_IN_ONE_DAY),
    },
  ];

  const result = await HabitModel.insertMany(habits);

  const habitCompletions = createHabitCompletionData(result);

  await HabitCompletionModel.insertMany(habitCompletions);

  console.log('Seed data completed');
  process.exit();
};

try {
  await seed();
} catch (error) {
  console.log(error.message);
  process.exit(1);
}
