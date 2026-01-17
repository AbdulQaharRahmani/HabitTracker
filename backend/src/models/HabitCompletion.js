import mongoose from 'mongoose';
import { DateHelper } from '../utils/date.js';

const HabitCompletionSchema = new mongoose.Schema(
  {
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Check if the habit is already completed for the same day.
HabitCompletionSchema.statics.isAlreadyCompleted = async function (habitId) {
  const [startOfToday, endOfToday] = DateHelper.getStartAndEndOfToday();

  const isCompleted = await this.exists({
    habitId,
    date: { $gte: startOfToday, $lte: endOfToday },
  });

  return isCompleted !== null;
};

export const HabitCompletionModel = mongoose.model(
  'HabitCompletion',
  HabitCompletionSchema
);