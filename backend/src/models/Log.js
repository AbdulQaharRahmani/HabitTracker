import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  level: { type: String, required: true },
  message: { type: String, required: true },
  metadata: { type: Object },
});

export const logModel = mongoose.model('Log', logSchema);
