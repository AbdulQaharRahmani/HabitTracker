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

  while (true) {
    const startOfDay = dayjs(currentDay).startOf('day').toDate();
    const endOfDay = dayjs(currentDay).endOf('day').toDate();

    const activeHabitIds = (
      await HabitModel.find({ userId: req.user._id, isDeleted: false }).select(
        '_id'
      )
    ).map((h) => h._id);
    console.log(activeHabitIds);

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

  const result = await HabitModel.aggregate([
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

  // console.log(result);
  res.status(200).json(result);

  // res.status(200).json({
  //   success: true,
  //   data: {
  //     totalHabits,
  //     currentStreak,
  //     completionRate,
  //   },
  // });
};
