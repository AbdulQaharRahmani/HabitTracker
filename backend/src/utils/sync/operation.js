import { OperationLogModel } from '../../models/OperationLog.js';

export async function getOperations(operations, userId, result) {
  const categoryOperations = [];
  const habitOperations = [];
  const taskOperations = [];
  const userPreferenceOperations = [];
  const habitCompletionOperations = [];

  const existingOps = await OperationLogModel.find({ userId })
    .select('operationId')
    .lean();
  const existingIds = new Set(existingOps.map((o) => o.operationId));

  for (let op of operations) {
    if (existingIds.has(op.operationId)) {
      result.skipped.push(op);
      continue;
    }

    switch (op.entity) {
      case 'category': {
        categoryOperations.push(op);
        break;
      }
      case 'habit': {
        habitOperations.push(op);
        break;
      }
      case 'task': {
        taskOperations.push(op);
        break;
      }
      case 'userPreference': {
        userPreferenceOperations.push(op);
        break;
      }
      case 'habitCompletion': {
        habitCompletionOperations.push(op);
        break;
      }
      default: {
        result.invalidEntity.push(op);
        break;
      }
    }
  }

  return [
    categoryOperations,
    habitOperations,
    taskOperations,
    userPreferenceOperations,
    habitCompletionOperations,
  ];
}
