import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import HabitCompletion from '../models/HabitCompletion.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    const data = JSON.parse(
      fs.readFileSync('data/bigSampleData.json', 'utf-8')
    );

    // پاک کردن دیتابیس (اختیاری)
    await User.deleteMany();
    await Habit.deleteMany();
    await HabitCompletion.deleteMany();

    // وارد کردن داده‌ها
    await User.insertMany(data.users);
    await Habit.insertMany(data.habits);
    await HabitCompletion.insertMany(data.habitCompletions);

    console.log('Data imported successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connectDB().then(importData);
