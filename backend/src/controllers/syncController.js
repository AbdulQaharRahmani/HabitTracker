import { HabitModel } from '../models/Habit.js';
import { OperationLogModel } from '../models/OperationLog.js';
import { UserModel } from '../models/User.js';
import { unauthorized } from '../utils/error.js';
import {
  createCategories,
  deleteCategories,
  updateCategories,
} from '../utils/sync/categorySync.js';
import { addHabitCompletions } from '../utils/sync/habitCompletionSync.js';
import {
  createHabits,
  deleteHabits,
  updateHabits,
} from '../utils/sync/habitSync.js';
import { getOperations } from '../utils/sync/operation.js';
import { applyUserPreferences } from '../utils/sync/preferenceSync.js';
import {
  createTasks,
  deleteTasks,
  updateTasks,
} from '../utils/sync/taskSync.js';

export const syncOfflineData = async (req, res) => {
  if (!req.user) throw unauthorized();

  const userId = req.user._id;

  const result = { applied: [], skipped: [], failed: [], invalidEntity: [] };

  const [
    categoryOperations,
    habitOperations,
    taskOperations,
    userPreferenceOperations,
    habitCompletionOperations,
  ] = await getOperations(req.body.operations, userId, result);

  const operationLogsList = [];
  const newOfflineCategories = {};
  const newOfflineHabits = {};

  // Get last habit order
  const lastHabit = await HabitModel.findOne({ userId })
    .sort({ order: -1 })
    .select('order');
  let lastHabitOrder = lastHabit ? lastHabit.order : 0;

  await createCategories(
    categoryOperations.filter((c) => c.type === 'create'),
    userId,
    newOfflineCategories,
    result,
    operationLogsList
  );

  await createHabits(
    habitOperations.filter((h) => h.type === 'create'),
    userId,
    lastHabitOrder,
    newOfflineCategories,
    newOfflineHabits,
    result,
    operationLogsList
  );

  await createTasks(
    taskOperations.filter((t) => t.type === 'create'),
    userId,
    newOfflineCategories,
    result,
    operationLogsList
  );

  await updateCategories(
    categoryOperations.filter((c) => c.type === 'update'),
    userId,
    result,
    operationLogsList
  );

  await updateHabits(
    habitOperations.filter((h) => h.type === 'update'),
    userId,
    newOfflineCategories,
    result,
    operationLogsList
  );

  await updateTasks(
    taskOperations.filter((t) => t.type === 'update'),
    userId,
    newOfflineCategories,
    result,
    operationLogsList
  );

  await deleteHabits(
    habitOperations.filter((h) => h.type === 'delete'),
    userId,
    result,
    operationLogsList
  );

  await deleteTasks(
    taskOperations.filter((t) => t.type === 'delete'),
    userId,
    result,
    operationLogsList
  );

  await deleteCategories(
    categoryOperations.filter((c) => c.type === 'delete'),
    userId,
    result,
    operationLogsList
  );

  await applyUserPreferences(
    userPreferenceOperations,
    userId,
    result,
    operationLogsList
  );

  await addHabitCompletions(
    habitCompletionOperations,
    userId,
    newOfflineHabits,
    result,
    operationLogsList
  );

  await UserModel.findByIdAndUpdate(userId, { lastTimeSync: new Date() });
  result.lastTimeSync = new Date();

  if (operationLogsList.length) {
    await OperationLogModel.insertMany(operationLogsList);
  }

  res.status(200).json({ success: true, data: result });
};
