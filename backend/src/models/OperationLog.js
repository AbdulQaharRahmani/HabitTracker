import mongoose from 'mongoose';

const operationLogSchema = new mongoose.Schema(
  {
    operationId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

operationLogSchema.index({ userId: 1, operationId: 1 });

export const OperationLogModel = mongoose.model(
  'operationLog',
  operationLogSchema
);
