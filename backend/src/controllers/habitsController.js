import { AppError } from '../utils/error.js';
import { HabitModel } from '../models/Habit.js';
import dayjs from 'dayjs';
import { HabitCompletion } from '../models/HabitCompletion.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';

export const getHabits = async (req, res) => {
  if (!req.user) {
    throw new AppError('User is not authorized.', 401);
  }

  const habits = await HabitModel.find({ userId: req.user._id });

  res.status(200).json({
    success: true,
    data: habits,
  });
};

export const createHabit = async (req, res) => {
  if (!req.user) {
    throw new AppError('User is not authorized.', 401);
  }

  const { title, description, frequency } = req.body;

  const habit = await HabitModel.create({
    userId: req.user._id,
    title,
    description,
    frequency,
  });

  res.status(201).json({
    success: true,
    data: habit,
  });
};

// export const getHabitsForSelectedDays = async (req, res) => {
//   // if (!req.user) throw new AppError('User is not authorized.', 401);

//   // const dateString = req.query.date || dayjs().format('YYYY-MM-DD');
//   const dateString = dayjs().format('YYYY-MM-DD');
//   const date = dayjs(dateString, 'YYYY-MM-DD', true);
//   console.log(dateString, date);

//   if (!date.isValid()) throw new AppError('Invalid date', 400);

//   const startOfDay = date.startOf('day').toDate();
//   const endOfDay = date.endOf('day').toDate();

//   const habits = await HabitModel.find({ userId: req.user._id });

//   const result = [];

//   for (let habit of habits) {
//     const day = date.day();
//     let isForToday = false;

//     switch (habit.frequency) {
//       case 'daily':
//         isForToday = true;
//         break;
//       case 'weekdays':
//         if (day >= 1 && day <= 5) isForToday = true;
//         break;
//       case 'weekends':
//         if (day === 0 || day === 6) isForToday = true;
//         break;
//       case 'every-other-day':
//         const daysSinceStart = dayjs(date).diff(dayjs(habit.createdAt), 'day');
//         if (daysSinceStart % 2 === 0) isForToday = true;
//         break;
//       case 'weekly':
//         if (day === dayjs(habit.createdAt).day()) isForToday = true;
//         break;
//       case 'biweekly':
//         const weeksSinceStart = Math.floor(
//           dayjs(date).diff(dayjs(habit.createdAt), 'day') / 7
//         );
//         if (day === dayjs(habit.createdAt).day() && weeksSinceStart % 2 === 0)
//           isForToday = true;
//         break;
//     }

//     if (!isForToday) continue;

//     // Check if habit is completed today (exists returns ObjectId or null)
//     const completed = await HabitCompletion.exists({
//       habitId: habit._id,
//       date: { $gte: startOfDay, $lte: endOfDay },
//     });

//     result.push({
//       _id: habit._id,
//       title: habit.title,
//       frequency: habit.frequency,
//       completed: !!completed, // !! convert ObjectId/null to true/false
//     });
//   }

//   res.status(200).json({
//     success: true,
//     data: result,
//   });
// };

export const getHabitsForSelectedDays = async (req, res) => {
  const dateString = req.query.date || dayjs().format('YYYY-MM-DD');
  const date = dayjs(dateString, 'YYYY-MM-DD', true);

  if (!date.isValid()) throw new AppError('Invalid date', 400);

  const startOfDay = date.startOf('day').toDate();
  const endOfDay = date.endOfDay('day').toDate();

  // Fetch all habits
  const habits = await HabitModel.find({ userId: req.user._id });

  // Fetch all completedHabits for this date in one query
  const completedHabits = await HabitCompletion.find({
    userId: req.user._id,
    date: { $gte: startOfDay, $lte: endOfDay },
  });

  // Create a set of completed habit IDs for O(1) lookup
  const completedHabitsIds = new Set(
    completedHabits.map((c) => c.habitId.toString())
  );

  const results = habits
    .filter((habit) => isHabitForSelectedDay(habit, date))
    .map((habit) => ({
      _id: habit._id,
      title: habit.title,
      frequency: habit.frequency,
      completed: completedHabitsIds.has(habit._id.toString()),
    }));

  res.status(200).json({
    success: true,
    data: results,
  });
};
