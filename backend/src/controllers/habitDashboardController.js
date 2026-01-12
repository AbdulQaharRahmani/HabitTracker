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
  let today = dayjs();
  let currentDay = today.toDate();

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

  // 3) Completion Rate with aggregation for better
  const startOfWeek = today.startOf('week').toDate();
  const endOfWeek = today.endOf('week').toDate();

  const habitsCompleted = await HabitCompletionModel.aggregate([
    {
      // Only this user's completions in the current week
      $match: {
        userId: req.user._id,
        date: { $gte: startOfWeek, $lte: endOfWeek },
      },
    },
    {
      // One document per unique habit
      $group: {
        _id: '$habitId',
      },
    },
    {
      // Count how many unique habits exist
      $count: 'totalDone',
    },
  ]);

  const completedHabits = habitsCompleted[0]?.totalDone || 0;
  console.log(habitsCompleted); // [ { totalDone: 1 } ]

  const completionRate = totalHabits
    ? Math.floor((completedHabits / totalHabits) * 100)
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

// ---------------------------------

// 3) Completion Rate without aggregation:

// const startOfWeek = dayjs(currentDay).startOf('week').toDate();
// const endOfWeek = dayjs(currentDay).endOf('week').toDate();

// const habitsCompleted = await HabitCompletionModel.find({
//   userId: req.user._id,
//   date: { $gte: startOfWeek, $lte: endOfWeek },
// });

// const habitsCompletedIds = new Set(
//   habitsCompleted.map((hab) => hab._id.toString())
// );

// const completionRate = totalHabits
//    ? Math.floor((habitsCompletedIds.size / totalHabits) * 100)
//   : 0;
