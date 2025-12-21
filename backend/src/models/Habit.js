import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, maxLength: 25, trim: true, required: true },
    description: { type: String, trim: true },
    frequency: {
      type: String,
      enum: [
        'daily',
        'everyotherday',
        'weekly',
        'biweekly',
        'weekdays',
        'weekends',
        'monthly',
        'quarterly',
        'yearly',
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const HabitModel = mongoose.model('Habit', HabitSchema);
