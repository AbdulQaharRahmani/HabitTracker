import dayjs from 'dayjs';
import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/habitCompletion.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';
import { PreferenceModel } from '../models/Preference.js';
import { DateHelper } from '../utils/date.js';
import { DAY_MAP } from '../utils/constant.js';

export const getHabitsDashboard = async (req, res) => {
  // Get user preference and start, end of week
  const userPreference = await PreferenceModel.findOne({
    userId: req.user._id,
  }).select('weekStartDay');

  const today = dayjs();

  const weekStartDayNum = DAY_MAP[userPreference.weekStartDay];

  const [startOfWeek, endOfWeek] = DateHelper.getStartAndEndOfWeek(
    today,
    weekStartDayNum
  );

  //----------- 1) Total Habits
  const totalHabits = await HabitModel.countDocuments({
    userId: req.user._id,
    isDeleted: false,
  });

  //------------ 2) Current Streak
  let currentStreak = 0;
  let currentDay = today.toDate();

  const activeHabitIds = (
    await HabitModel.find({ userId: req.user._id, isDeleted: false }).select(
      '_id'
    )
  ).map((h) => h._id);

  while (true) {
    const startOfDay = dayjs(currentDay).startOf('day').toDate();
    const endOfDay = dayjs(currentDay).endOf('day').toDate();

    const exist = await HabitCompletionModel.exists({
      userId: req.user._id,
      habitId: { $in: activeHabitIds },
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (exist) {
      currentStreak++;
      currentDay = dayjs(currentDay).subtract(1, 'day').toDate();
    } else break;
  }

  //------- 3) Completion Rate: Aggregate habits with their completions filtered to current week

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
    // Filter completions to only those within the current week
    {
      $addFields: {
        CompletedHabits: {
          $filter: {
            input: '$CompletedHabits',
            as: 'completion',
            cond: {
              $and: [
                { $gte: ['$$completion.date', startOfWeek.toDate()] },
                { $lte: ['$$completion.date', endOfWeek.toDate()] },
              ],
            },
          },
        },
      },
    },
  ]);

  let totalExpected = 0;
  let totalCompleted = 0;

  // Calculate expected vs actual completions for each habit in the week
  habits.forEach((habit) => {
    const habitStart = dayjs(habit.createdAt).isAfter(startOfWeek)
      ? dayjs(habit.createdAt)
      : startOfWeek;

    const actualCompletions = habit.CompletedHabits.length;

    let expectedOccurrences = 0;
    let currentDay = dayjs(habitStart);
    const weekEnd = dayjs(endOfWeek);

    while (currentDay.isBefore(weekEnd) || currentDay.isSame(weekEnd, 'day')) {
      if (isHabitForSelectedDay(habit, currentDay)) {
        expectedOccurrences++;
      }
      currentDay = currentDay.add(1, 'day');
    }

    totalExpected += expectedOccurrences;
    totalCompleted += actualCompletions;
  });

  const completionRate =
    totalExpected === 0
      ? 0
      : Math.round((totalCompleted / totalExpected) * 100);

  //------------- 4) Chart Data: Build daily completion counts for the current month

  const startOfMonth = dayjs(today).startOf('month').toDate();
  const endOfMonth = dayjs(today).endOf('month').toDate();

  // Fetch all habit completions for the month
  const monthlyCompletions = await HabitCompletionModel.find({
    userId: req.user._id,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  // Group completions by date (YYYY-MM-DD)
  const completionByDay = {};
  monthlyCompletions.forEach((completion) => {
    const dateKey = dayjs(completion.date).format('YYYY-MM-DD');
    completionByDay[dateKey] = (completionByDay[dateKey] || 0) + 1;
  });

  // Build array of daily data from start of month to today
  const chartData = [];
  let currentDate = dayjs(startOfMonth);
  const todayEnd = dayjs(today);

  while (
    currentDate.isBefore(todayEnd) ||
    currentDate.isSame(todayEnd, 'day')
  ) {
    const dateKey = currentDate.format('YYYY-MM-DD');
    chartData.push({
      date: dateKey,
      completed: completionByDay[dateKey] || 0,
    });
    currentDate = currentDate.add(1, 'day');
  }

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
