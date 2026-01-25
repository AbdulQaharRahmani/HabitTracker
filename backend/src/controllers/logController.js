import { logModel } from '../models/Log.js';

export const createLog = async ({ level, message, metadata }) => {
  await logModel.create({
    level,
    message,
    metadata,
  });
};
export const getLogs = async (req, res) => {
  const logs = await logModel.find().sort({ timestamp: -1 }).limit(100);

  res.status(200).json({
    success: true,
    data: logs,
  });
};
