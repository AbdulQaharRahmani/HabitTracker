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
        'every-other-day',
        'weekly',
        'biweekly',
        'weekdays',
        'weekends',
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Return true if user is owner of Habit, otherwise false
HabitSchema.methods.isOwner = function (userId) {
  return String(this.userId) === String(userId);
};

// User can not create two habit with same title
HabitSchema.index({ userId: 1, title: 1 }, { unique: true });

export const HabitModel = mongoose.model('Habit', HabitSchema);
