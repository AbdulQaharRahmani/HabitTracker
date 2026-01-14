import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/habitCompletion.js';
import dayjs from 'dayjs';
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

  /*
  let sum = 0;

  result.map((res) => {
    switch (res.frequency) {
      case 'daily':
        sum += res.CompletedHabits.length / 7;
        // console.log(sum);
        break;
      case 'every-other-day':
        sum += res.CompletedHabits.length / 3;
        // console.log(sum);
        break;
      case 'weekly':
        sum += res.CompletedHabits.length / 1;
        // console.log(sum);
        break;
      case 'biweekly':
        sum += res.CompletedHabits.length / 0.5;
        // console.log(sum);
        break;
      default:
        return;
    }
  });

  console.log(Math.round(sum));
  // console.log(result.length);
  res.status(200).json(result);
*/
  /*
  let totalExpectedCompletions = 0;
  let totalActualCompletions = 0;

  const frequencyMap = {
    daily: 7,
    'every-other-day': 3,
    weekly: 1,
    biweekly: 2,
  };

  habits.forEach((habit) => {
    const expected = frequencyMap[habit.frequency] || 0;
    const actual = habit.CompletedHabits.length;

    totalExpectedCompletions += expected;
    totalActualCompletions += Math.min(actual, expected);
  });

  const completionRate =
    totalExpectedCompletions === 0
      ? 0
      : Math.round((totalActualCompletions / totalExpectedCompletions) * 100);
*/
  res.status(200).json({
    success: true,
    data: {
      totalHabits,
      currentStreak,
      completionRate,
    },
  });
};
