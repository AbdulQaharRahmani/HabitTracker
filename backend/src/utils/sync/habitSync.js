import { HabitModel } from '../../models/Habit.js';

export async function createHabits(
  habits,
  userId,
  lastHabitOrder,
  newOfflineCategories,
  newOfflineHabits,
  result,
  operationLogsList
) {
  for (const habit of habits) {
    try {
      const createQuery = {
        ...habit.payload,
        userId,
        clientId: habit.clientId,
        order: ++lastHabitOrder,
        startDate: habit.payload.startDate || new Date(),
      };

      const clientCategoryId = habit.payload?.categoryClientId;
      if (clientCategoryId && newOfflineCategories[clientCategoryId]) {
        createQuery.categoryId = newOfflineCategories[clientCategoryId];
      }

      const newHabit = await HabitModel.create(createQuery);
      newOfflineHabits[habit.clientId] = newHabit._id.toString();
      operationLogsList.push({ operationId: habit.operationId, userId });
      result.applied.push({
        operationId: habit.operationId,
        _id: newHabit._id.toString(),
      });
    } catch (error) {
      result.failed.push({
        ...habit,
        message: error.code === 11000 ? 'Habit already exists' : error.message,
      });
    }
  }
  return lastHabitOrder;
}

export async function updateHabits(
  habits,
  userId,
  newOfflineCategories,
  result,
  operationLogsList
) {
  for (const habit of habits) {
    try {
      const allowedFieldsToUpdate = {
        categoryId: true,
        title: true,
        description: true,
        frequency: true,
      };

      const updateQuery = {};
      for (const key of Object.keys(habit.payload)) {
        if (key in allowedFieldsToUpdate) updateQuery[key] = habit.payload[key];
      }

      if (
        updateQuery.categoryId &&
        newOfflineCategories[updateQuery.categoryId]
      ) {
        updateQuery.categoryId = newOfflineCategories[updateQuery.categoryId];
      }

      const updated = await HabitModel.findOneAndUpdate(
        { userId, clientId: habit.clientId },
        { $set: updateQuery },
        { new: true }
      );

      if (updated) {
        operationLogsList.push({ operationId: habit.operationId, userId });
        result.applied.push({
          operationId: habit.operationId,
          _id: updated._id.toString(),
        });
      } else {
        result.failed.push({ ...habit, message: 'Habit not found' });
      }
    } catch (error) {
      result.failed.push({ ...habit, message: error.message });
    }
  }
}

export async function deleteHabits(habits, userId, result, operationLogsList) {
  for (const habit of habits) {
    try {
      const habitRecord = await HabitModel.findOne({
        userId,
        clientId: habit.clientId,
      });
      if (!habitRecord) {
        result.failed.push({ ...habit, message: 'Habit not found' });
        continue;
      }

      if (!habitRecord.isDeleted) {
        habitRecord.isDeleted = true;
        await habitRecord.save();
      }

      operationLogsList.push({ operationId: habit.operationId, userId });
      result.applied.push({
        operationId: habit.operationId,
        _id: habitRecord._id.toString(),
      });
    } catch (error) {
      result.failed.push({ ...habit, message: error.message });
    }
  }
}
