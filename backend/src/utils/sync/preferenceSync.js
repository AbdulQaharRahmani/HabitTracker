import { PreferenceModel } from '../../models/Preference.js';
import { DateHelper } from '../date.js';

export async function applyUserPreferences(
  prefOps,
  userId,
  result,
  operationLogsList
) {
  for (const prefOp of prefOps) {
    try {
      const payload = prefOp.payload;
      const allowedFields = {
        weekStartDay: true,
        dailyReminderTime: true,
        dailyReminderEnabled: true,
        timezone: true,
        streakAlertEnabled: true,
        weeklySummaryEmailEnabled: true,
        theme: true,
      };

      const updateQuery = {};
      for (let key of Object.keys(payload)) {
        if (key in allowedFields) updateQuery[key] = payload[key];
      }

      if (updateQuery.timezone) {
        updateQuery.timezone = DateHelper.TIMEZONES[updateQuery.timezone];
      }

      const preference = await PreferenceModel.findOneAndUpdate(
        { userId },
        { $setOnInsert: { userId }, $set: updateQuery },
        { upsert: true, new: true, runValidators: true }
      );

      operationLogsList.push({ operationId: prefOp.operationId, userId });
      result.applied.push({
        operationId: prefOp.operationId,
        _id: preference._id.toString(),
      });
    } catch (error) {
      result.failed.push({ ...prefOp, message: error.message });
    }
  }
}
