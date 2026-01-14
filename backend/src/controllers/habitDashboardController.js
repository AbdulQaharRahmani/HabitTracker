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

  const habitsCompleted = await HabitCompletionModel.aggregate([
    {
      $match: {
        userId: req.user._id,
        date: { $gte: startOfWeek, $lte: endOfWeek },
      },
    },
    {
      $count: 'totalDone',
    },
  ]);

  const completedHabits = habitsCompleted[0]?.totalDone || 0;
  console.log(completedHabits);

  //----------------------------

  const isHabitForWeek = (habit) => {
    const start = dayjs(startOfWeek);

    for (let i = 0; i < 7; i++) {
      if (isHabitForSelectedDay(habit, start.add(i, 'day'))) {
        return true;
      }
    }
    return false;
  };

  const habits = await HabitModel.find({
    userId: req.user._id,
    isDeleted: false,
  }).lean();

  const habitsThisWeek = habits.filter(isHabitForWeek);
  const totalHabitsWeek = habitsThisWeek.length;
  console.log(totalHabitsWeek);

  const completionRate =
    totalHabitsWeek > 0
      ? Math.round((completedHabits / totalHabitsWeek) * 100)
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
