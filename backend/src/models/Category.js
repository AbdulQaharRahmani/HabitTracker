import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 1,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    icon: { type: String, default: '', trim: true },
    backgroundColor: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

CategorySchema.statics.doesCategoryExist = function (categoryId, userId) {
  return this.exists({ _id: categoryId, userId });
};

export const CategoryModel = mongoose.model('Category', CategorySchema);
