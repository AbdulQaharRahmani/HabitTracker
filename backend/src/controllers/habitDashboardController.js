import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
dayjs.extend(isSameOrBefore);
import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/habitCompletion.js';
import { isHabitForSelectedDay } from '../utils/habitFrequency.js';
import { PreferenceModel } from '../models/Preference.js';
import { DateHelper } from '../utils/date.js';
import { DAY_MAP, ERROR_CODES } from '../utils/constant.js';
import { AppError } from '../utils/error.js';
import { getActiveHabitIds } from '../utils/habit.js';

export const getHabitsDashboard = async (req, res) => {
  // Get user preference and start, end of week
  const userPreference = await PreferenceModel.findOne({
    userId: req.user._id,
  }).select('weekStartDay');

  const today = dayjs();

  const weekStartDayNum = DAY_MAP[userPreference?.weekStartDay];

  const [startOfWeek, endOfWeek] = DateHelper.getStartAndEndOfWeek(
    today,
    weekStartDayNum
  );

  //----------- 1) Total Habits
  const totalHabits = await HabitModel.countDocuments({
    userId: req.user._id,
    isDeleted: false,
  });

  //------------ 2) Current Streak: Number of consecutive days the user completed habits
  let currentStreak = 0;
  let currentDay = today.toDate();

  const activeHabitIds = await getActiveHabitIds(req.user._id);

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

  //----------- 3) Completion Rate:  Percentage of habits completed during the week
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

    while (currentDay.isSameOrBefore(weekEnd, 'day')) {
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

  res.status(200).json({
    success: true,
    data: {
      totalHabits,
      currentStreak,
      completionRate,
    },
  });
};

// Chart Data: Build daily completion counts for given date
export const getHabitChartData = async (req, res) => {
  const today = dayjs();

  const startDate = req.query.startDate
    ? dayjs(req.query.startDate).startOf('day')
    : today.clone().subtract(29, 'day').startOf('day');

  const endDate = req.query.endDate
    ? dayjs(req.query.endDate).endOf('day')
    : today.endOf('day');

  if (!startDate.isValid() || !endDate.isValid()) {
    throw new AppError(
      'Invalid date format',
      400,
      ERROR_CODES.INVALID_DATE_FORMAT
    );
  }
  if (endDate.isBefore(startDate)) {
    throw new AppError(
      'End date is before start date',
      400,
      ERROR_CODES.END_DATE_BEFORE_START_DATE
    );
  }

  const activeHabitIds = await getActiveHabitIds(req.user._id);

  const completions = await HabitCompletionModel.aggregate([
    {
      $match: {
        userId: req.user._id,
        habitId: { $in: activeHabitIds },
        date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        },
        completed: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // [
  //  { _id: '2025-12-02', completed: 4 },
  //  { _id: '2025-12-03', completed: 2 },
  // ]

  const completionMap = {};
  completions.forEach((r) => {
    completionMap[r._id] = r.completed;
  });

  // { '2025-12-02': 3 },
  // { '2025-12-04': 1 },

  const chartData = [];
  let currentDate = startDate.clone();

  while (currentDate.isSameOrBefore(endDate, 'day')) {
    const dateKey = currentDate.format('YYYY-MM-DD');

    chartData.push({
      date: dateKey,
      completed: completionMap[dateKey] || 0,
    });

    currentDate = currentDate.add(1, 'day');
  }

  // [
  //  { date: '2025-12-02', completed: 3 },
  //  { date: '2025-12-03', completed: 0 },  // missing day
  //  { date: '2025-12-04', completed: 1 },
  // ]

  res.status(200).json({
    success: true,
    data: chartData,
  });
};
