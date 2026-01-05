import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/habitCompletion.js';
import dayjs from 'dayjs';

export const getHabitsDashboard = async (req, res) => {
  // 1) Total Habits
  const totalHabits = await HabitModel.countDocuments({
    userId: req.user._id,
    isDeleted: false,
  });

  // 2) Current Streak
  let currentStreak = 0;
  let currentDay = dayjs();

  while (true) {
    const startOfDay = dayjs(currentDay).startOf('day').toDate();
    const endOfDay = dayjs(currentDay).endOf('day').toDate();

    const exist = await HabitCompletionModel.exists({
      userId: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (exist) {
      currentStreak++;
      currentDay = dayjs(currentDay).subtract(1, 'day').toDate();
    } else break;
  }

  // 3) Completion Rate
  const startOfWeek = dayjs(currentDay).startOf('week').toDate();
  const endOfWeek = dayjs(currentDay).endOf('week').toDate();

  const habitsCompleted = await HabitCompletionModel.find({
    userId: req.user._id,
    date: { $gte: startOfWeek, $lte: endOfWeek },
  });

  const habitsCompletedIds = new Set(
    habitsCompleted.map((hab) => hab._id.toString())
  );

  const completionRate = totalHabits
    ? Math.floor((habitsCompletedIds.size / totalHabits) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalHabits,
      currentStreak,
      completionRate,
    },
  });
};
