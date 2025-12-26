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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add { isDeleted: false } to find, findOne, FindById queries
HabitModel.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// Return true if user is owner of Habit, otherwise false
HabitSchema.methods.isOwner = function (userId) {
  return String(this.userId) === String(userId);
};

export const HabitModel = mongoose.model('Habit', HabitSchema);
