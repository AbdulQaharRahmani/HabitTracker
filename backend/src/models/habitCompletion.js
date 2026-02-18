import mongoose from 'mongoose';

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
HabitCompletionSchema.statics.isAlreadyCompleted = async function (
  habitId,
  selectedDate
) {
  const isCompleted = await this.exists({
    habitId,
    date: selectedDate,
  });

  return isCompleted;
};

export const HabitCompletionModel = mongoose.model(
  'HabitCompletion',
  HabitCompletionSchema
);
