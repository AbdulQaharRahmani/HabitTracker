import dayjs from 'dayjs';
import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/habitCompletion.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';

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

  const activeHabitIds = (
    await HabitModel.find({ userId: req.user._id, isDeleted: false }).select(
      '_id'
    )
  ).map((h) => h._id);
  // console.log(activeHabitIds);

  while (true) {
    const startOfDay = dayjs(currentDay).startOf('day').toDate();
    const endOfDay = dayjs(currentDay).endOf('day').toDate();

    const exist = await HabitCompletionModel.exists({
      userId: req.user._id,
      habitId: { $in: activeHabitIds },
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    // console.log('exist', exist);
    // console.log('startOfDay', startOfDay);
    // console.log('endOfDay', endOfDay);

    if (exist) {
      currentStreak++;
      currentDay = dayjs(currentDay).subtract(1, 'day').toDate();
    } else break;
  }

  // 3) Completion Rate with aggregation for better
  const startOfWeek = today.startOf('week').toDate();
  const endOfWeek = today.endOf('week').toDate();

  const habits = await HabitModel.aggregate([
    { $match: { userId: req.user._id, isDeleted: false } },
    {
      $lookup: {
        from: 'habitcompletions',
        localField: '_id',
        foreignField: 'habitId',
        as: 'CompletedHabits',
      },
    },
    {
      $addFields: {
        CompletedHabits: {
          $filter: {
            input: '$CompletedHabits',
            as: 'completion',
            cond: {
              $and: [
                { $gte: ['$$completion.date', startOfWeek] },
                { $lte: ['$$completion.date', endOfWeek] },
              ],
            },
          },
        },
      },
    },
  ]);

  let totalExpected = 0;
  let totalCompleted = 0;

  habits.forEach((habit) => {
    const habitStart = dayjs(habit.createdAt).isAfter(startOfWeek)
      ? dayjs(habit.createdAt)
      : dayjs(startOfWeek);

    // Count how many times this habit was actually completed
    const actual = habit.CompletedHabits.length;

    let expected = 0; // Counter for how many times this habit should occur in the week

    // Loop through each day from habitStart to the end of the week
    let current = dayjs(habitStart);
    const end = dayjs(endOfWeek);

    while (current.isBefore(end) || current.isSame(end, 'day')) {
      // Use helper to check if habit is supposed to occur on this day
      if (isHabitForSelectedDay(habit, current)) expected++;
      // Move to the next day
      current = current.add(1, 'day');
    }

    // Add this habit's counts to the total counters
    totalExpected += expected;
    totalCompleted += actual;
  });

  const completionRate =
    totalExpected === 0
      ? 0
      : Math.round((totalCompleted / totalExpected) * 100);

  // 4) Chart data
  const chartData = {};

  const startOfMonth = dayjs(today).startOf('month').toDate();
  let current = dayjs(startOfMonth);
  const end = dayjs(today);
  // console.log(startOfMonth, end);

  // console.log(habitCompletions.length);

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    console.log(current.toDate());
    const todayCompletions = await HabitCompletionModel.countDocuments({
      userId: req.user._id,
      date: current,
    });

    chartData[current] = todayCompletions;
    current = current.add(1, 'day');
  }
  console.log(chartData);

  res.status(200).json({
    success: true,
    data: {
      totalHabits,
      currentStreak,
      completionRate,
      chartData,
    },
  });
};
