import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['todo', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    dueDate: {
      type: Date,
      default: new Date(),
    },
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
    deletedAt: {
      type: Date,
      default: null,
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

taskSchema.index({ userId: 1, isDeleted: false });

taskSchema.index(
  { title: 1, userId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);
// partialFilterExpression => Create a unique index only for non-deleted tasks

export const TaskModel = mongoose.model('Task', taskSchema);
