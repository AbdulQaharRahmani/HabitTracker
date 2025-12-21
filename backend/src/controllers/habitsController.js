import Habit from '../models/habitModel.js';

export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });

    res.json({
      status: 'success',
      results: habits.length,
      data: {
        habits,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};
