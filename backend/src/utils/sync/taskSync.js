import { TaskModel } from '../../models/Task.js';

export async function createTasks(
  tasks,
  userId,
  newOfflineCategories,
  result,
  operationLogsList
) {
  for (const task of tasks) {
    try {
      const createQuery = { ...task.payload, userId, clientId: task.clientId };

      const clientCategoryId = task.payload?.categoryClientId;
      if (clientCategoryId && newOfflineCategories[clientCategoryId]) {
        createQuery.categoryId = newOfflineCategories[clientCategoryId];
      }

      const newTask = await TaskModel.create(createQuery);
      operationLogsList.push({ operationId: task.operationId, userId });
      result.applied.push({
        operationId: task.operationId,
        _id: newTask._id.toString(),
      });
    } catch (error) {
      result.failed.push({
        ...task,
        message: error.code === 11000 ? 'Task already exists' : error.message,
      });
    }
  }
}

export async function updateTasks(
  tasks,
  userId,
  newOfflineCategories,
  result,
  operationLogsList
) {
  for (const task of tasks) {
    try {
      const allowedFieldsToUpdate = {
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        categoryId: true,
      };

      const updateQuery = {};
      for (const key of Object.keys(task.payload)) {
        if (key in allowedFieldsToUpdate) updateQuery[key] = task.payload[key];
      }

      if (
        updateQuery.categoryId &&
        newOfflineCategories[updateQuery.categoryId]
      ) {
        updateQuery.categoryId = newOfflineCategories[updateQuery.categoryId];
      }

      const updated = await TaskModel.findOneAndUpdate(
        { userId, clientId: task.clientId },
        { $set: updateQuery },
        { new: true }
      );

      if (updated) {
        operationLogsList.push({ operationId: task.operationId, userId });
        result.applied.push({
          operationId: task.operationId,
          _id: updated._id.toString(),
        });
      } else {
        result.failed.push({ ...task, message: 'Task not found' });
      }
    } catch (error) {
      result.failed.push({ ...task, message: error.message });
    }
  }
}

export async function deleteTasks(tasks, userId, result, operationLogsList) {
  for (const task of tasks) {
    try {
      const taskRecord = await TaskModel.findOne({
        userId,
        clientId: task.clientId,
      });
      if (!taskRecord) {
        result.failed.push({ ...task, message: 'Task not found' });
        continue;
      }

      if (!taskRecord.isDeleted) {
        taskRecord.isDeleted = true;
        taskRecord.deletedAt = new Date();
        await taskRecord.save();
      }

      operationLogsList.push({ operationId: task.operationId, userId });
      result.applied.push({
        operationId: task.operationId,
        _id: taskRecord._id.toString(),
      });
    } catch (error) {
      result.failed.push({ ...task, message: error.message });
    }
  }
}
