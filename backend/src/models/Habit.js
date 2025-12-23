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
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

HabitSchema.index({ userId: 1, order: 1 });

//Return the query object that can be awaited
HabitSchema.statics.findByUserAndSortByOrder = function (userId) {
  return this.find({ userId }).sort({ order: 1 });
};

// Return the query object that can be awaited
HabitSchema.statics.getHabitCountByUserId = function (userId) {
  return this.countDocuments({ userId });
};

export const HabitModel = mongoose.model('Habit', HabitSchema);
