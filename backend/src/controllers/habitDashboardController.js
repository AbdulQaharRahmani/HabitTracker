import { HabitModel } from '../models/Habit.js';
import { HabitCompletionModel } from '../models/habitCompletion.js';
import dayjs from 'dayjs';

export const getHabitsDashboard = async (req, res) => {
  const userId = req.user._id;

  // 1) Total habits
  const totalHabits = await HabitModel.countDocuments({
    userId,
    isDeleted: false,
  });

  // 2) current streak (e.g. 2)
  let streak = 0;
  let currentDay = dayjs();

  while (true) {
    const startOfDay = dayjs(currentDay).startOf('day').toDate();
    const endOfDay = dayjs(currentDay).endOf('day').toDate();

    const exists = await HabitCompletionModel.exists({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (exists) {
      streak++;
      currentDay = dayjs(currentDay).subtract(1, 'day'); //means => currentDay -= 1
    } else break;
  }

  // console.log(currentDay); // 2026-01-04T14:28:10.255Z
  // console.log(startOfDay); // 2026-01-03T19:30:00.000Z
  // console.log(endOfDay); // 2026-01-04T19:29:59.999Z

  // 3) Completion rate

  const startOfWeek = dayjs().startOf('week').toDate();
  const endOfWeek = dayjs().endOf('week').toDate();

  const habitsCompleted = await HabitCompletionModel.find({
    userId,
    date: { $gte: startOfWeek, $lte: endOfWeek },
  }).lean();

  const habitsCompletedIds = new Set(
    habitsCompleted.map((doc) => doc.habitId.toString())
  );

  const completionRate = totalHabits
    ? Math.floor((habitsCompletedIds.size / totalHabits) * 100)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalHabits,
      streak,
      completionRate,
    },
  });
};
