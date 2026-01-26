import { HabitCompletionModel } from '../../models/habitCompletion.js';
import { DateHelper } from '../date.js';

export async function addHabitCompletions(
  completionOps,
  userId,
  newOfflineHabits,
  result,
  operationLogsList
) {
  for (const completionOp of completionOps) {
    try {
      let habitId = completionOp.payload?.habitId;

      if (
        completionOp.payload.habitClientId &&
        newOfflineHabits[completionOp.payload.habitClientId]
      ) {
        habitId = newOfflineHabits[completionOp.payload.habitClientId];
      }

      const startOfDay = DateHelper.getStartOfDate(completionOp.payload.date);
      const endOfDay = DateHelper.getEndOfDate(completionOp.payload.date);

      const existing = await HabitCompletionModel.findOne({
        habitId,
        userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      if (existing) {
        result.applied.push({
          operationId: completionOp.operationId,
          _id: existing._id.toString(),
        });
        continue;
      }

      const newCompletion = await HabitCompletionModel.create({
        habitId,
        userId,
        date: completionOp.payload.date,
      });

      operationLogsList.push({ operationId: completionOp.operationId, userId });
      result.applied.push({
        operationId: completionOp.operationId,
        _id: newCompletion._id.toString(),
      });
    } catch (error) {
      result.failed.push({ ...completionOp, message: error.message });
    }
  }
}
