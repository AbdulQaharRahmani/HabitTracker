import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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
    order: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// find docs wih { isDeleted: false } in this queries: (find, findOne, findById)
HabitSchema.pre(/^find/, function () {
  this.where({ isDeleted: false });
});

HabitSchema.index({ userId: 1, order: 1 });
HabitSchema.index({ userId: 1, title: 1 }, { unique: true });

//Return the query object that can be awaited
HabitSchema.statics.findByUserAndSortByOrder = function (userId) {
  return this.find({ userId })
    .populate('categoryId', 'name icon backgroundColor')
    .sort({ order: 1 })
    .lean();
};

// Return the query object that can be awaited
HabitSchema.statics.getHabitCountByUserId = function (userId) {
  return this.countDocuments({ userId });
};

// Return true if user is owner of Habit, otherwise false
HabitSchema.methods.isOwner = function (userId) {
  return String(this.userId) === String(userId);
};

export const HabitModel = mongoose.model('Habit', HabitSchema);
