import { CategoryModel } from '../models/Category.js';
import { HabitModel } from '../models/Habit.js';
import { OperationLogModel } from '../models/OperationLog.js';
import { TaskModel } from '../models/Task.js';
import { UserModel } from '../models/User.js';
import { unauthorized } from '../utils/error.js';

export const syncOfflineData = async (req, res) => {
  if (!req.user) throw unauthorized();

  const userId = req.user._id;

  const result = { applied: [], skipped: [], failed: [] };

  const [categoryOperations, habitOperations, taskOperations] =
    await getOperations(req.body.operations, userId, result);

  const operationLogsList = [];
  const newOfflineCategories = {};

  // Get last habit order
  const lastHabit = await HabitModel.findOne({ userId })
    .sort({ order: -1 })
    .select('order');
  let lastHabitOrder = lastHabit ? lastHabit.order : 0;

  for (const category of categoryOperations.filter(
    (c) => c.type === 'create'
  )) {
    try {
      const newCategory = await CategoryModel.create({
        ...category.payload,
        userId,
        clientId: category.clientId,
      });
      newOfflineCategories[category.clientId] = newCategory._id.toString();
      operationLogsList.push({ operationId: category.operationId, userId });
      result.applied.push({ operationId: category.operationId });
    } catch (error) {
      result.failed.push({
        ...category,
        message:
          error.code === 11000 ? 'Category already exists' : error.message,
      });
    }
  }

  for (const habit of habitOperations.filter((h) => h.type === 'create')) {
    try {
      const createQuery = {
        ...habit.payload,
        userId,
        clientId: habit.clientId,
        order: ++lastHabitOrder,
        startDate: habit.payload.startDate || new Date(),
      };

      const clientCategoryId = habit.payload.categoryClientId;
      if (clientCategoryId && clientCategoryId in newOfflineCategories) {
        createQuery.categoryId = newOfflineCategories[clientCategoryId];
      }

      await HabitModel.create(createQuery);
      operationLogsList.push({ operationId: habit.operationId, userId });
      result.applied.push({ operationId: habit.operationId });
    } catch (error) {
      result.failed.push({
        ...habit,
        message: error.code === 11000 ? 'Habit already exists' : error.message,
      });
    }
  }

  for (const task of taskOperations.filter((t) => t.type === 'create')) {
    try {
      const createQuery = {
        ...task.payload,
        userId,
        clientId: task.clientId,
      };

      const clientCategoryId = task.payload.categoryClientId;
      if (clientCategoryId && clientCategoryId in newOfflineCategories) {
        createQuery.categoryId = newOfflineCategories[clientCategoryId];
      }

      await TaskModel.create(createQuery);
      operationLogsList.push({ operationId: task.operationId, userId });
      result.applied.push({ operationId: task.operationId });
    } catch (error) {
      result.failed.push({
        ...task,
        message: error.code === 11000 ? 'Task already exists' : error.message,
      });
    }
  }

  for (const category of categoryOperations.filter(
    (c) => c.type === 'update'
  )) {
    try {
      const allowedFieldsToUpdate = {
        name: true,
        icon: true,
        backgroundColor: true,
      };

      const updateQuery = {};
      for (const key of Object.keys(category.payload)) {
        if (key in allowedFieldsToUpdate)
          updateQuery[key] = category.payload[key];
      }

      await CategoryModel.updateOne(
        { userId, clientId: category.clientId },
        { $set: updateQuery }
      );

      operationLogsList.push({ operationId: category.operationId, userId });
      result.applied.push({ operationId: category.operationId });
    } catch (error) {
      result.failed.push({ ...category, message: error.message });
    }
  }

  for (const habit of habitOperations.filter((h) => h.type === 'update')) {
    try {
      const allowedFieldsToUpdate = {
        categoryId: true,
        title: true,
        description: true,
        frequency: true,
        order: true,
      };

      const updateQuery = {};

      for (const key of Object.keys(habit.payload)) {
        if (key in allowedFieldsToUpdate) updateQuery[key] = habit.payload[key];
      }

      if (
        'categoryId' in updateQuery &&
        updateQuery.categoryId in newOfflineCategories
      ) {
        updateQuery.categoryId = newOfflineCategories[updateQuery.categoryId];
      }

      await HabitModel.updateOne(
        { userId, clientId: habit.clientId },
        { $set: updateQuery }
      );

      operationLogsList.push({ operationId: habit.operationId, userId });
      result.applied.push({ operationId: habit.operationId });
    } catch (error) {
      result.failed.push({ ...habit, message: error.message });
    }
  }

  for (const task of taskOperations.filter((t) => t.type === 'update')) {
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
        'categoryId' in updateQuery &&
        updateQuery.categoryId in newOfflineCategories
      ) {
        updateQuery.categoryId = newOfflineCategories[updateQuery.categoryId];
      }

      await TaskModel.updateOne(
        { userId, clientId: task.clientId },
        { $set: updateQuery }
      );

      operationLogsList.push({ operationId: task.operationId, userId });
      result.applied.push({ operationId: task.operationId });
    } catch (error) {
      result.failed.push({ ...task, message: error.message });
    }
  }

  for (const habit of habitOperations.filter((h) => h.type === 'delete')) {
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
      result.applied.push({ operationId: habit.operationId });
    } catch (error) {
      result.failed.push({ ...habit, message: error.message });
    }
  }

  for (const task of taskOperations.filter((t) => t.type === 'delete')) {
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
      result.applied.push({ operationId: task.operationId });
    } catch (error) {
      result.failed.push({ ...task, message: error.message });
    }
  }

  for (const category of categoryOperations.filter(
    (c) => c.type === 'delete'
  )) {
    try {
      const categoryRecord = await CategoryModel.findOne({
        userId,
        clientId: category.clientId,
      });

      if (!categoryRecord) {
        result.failed.push({ ...category, message: 'Category not found' });
        continue;
      }

      const habitUsing = await HabitModel.exists({
        userId,
        categoryId: categoryRecord._id,
      });
      const taskUsing = await TaskModel.exists({
        userId,
        categoryId: categoryRecord._id,
      });

      if (habitUsing || taskUsing) {
        result.failed.push({
          ...category,
          message: 'Category is in use by habits or tasks',
        });
        continue;
      }

      await CategoryModel.deleteOne({ _id: categoryRecord._id });
      operationLogsList.push({ operationId: category.operationId, userId });
      result.applied.push({ operationId: category.operationId });
    } catch (error) {
      result.failed.push({ ...category, message: error.message });
    }
  }

  await UserModel.findByIdAndUpdate(userId, { lastTimeSync: new Date() });
  result.lastTimeSync = new Date();

  if (operationLogsList.length) {
    await OperationLogModel.insertMany(operationLogsList);
  }

  res.status(200).json({ success: true, data: result });
};

async function getOperations(operations, userId, result) {
  const categoryOperations = [];
  const habitOperations = [];
  const taskOperations = [];
  const invalidEntity = [];

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
      default: {
        invalidEntity.push(op);
        break;
      }
    }
  }

  return [categoryOperations, habitOperations, taskOperations, invalidEntity];
}
