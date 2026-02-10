import { CategoryModel } from '../../models/Category.js';
import { HabitModel } from '../../models/Habit.js';
import { TaskModel } from '../../models/Task.js';

export async function createCategories(
  categories,
  userId,
  newOfflineCategories,
  result,
  operationLogsList
) {
  for (const category of categories) {
    try {
      const newCategory = await CategoryModel.create({
        ...category.payload,
        userId,
        clientId: category.clientId,
      });

      newOfflineCategories[category.clientId] = newCategory._id.toString();
      operationLogsList.push({ operationId: category.operationId, userId });
      result.applied.push({
        operationId: category.operationId,
        _id: newCategory._id.toString(),
      });
    } catch (error) {
      result.failed.push({
        ...category,
        message:
          error.code === 11000 ? 'Category already exists' : error.message,
      });
    }
  }
}

export async function updateCategories(
  categories,
  userId,
  result,
  operationLogsList
) {
  for (const category of categories) {
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

      const updated = await CategoryModel.findOneAndUpdate(
        { userId, clientId: category.clientId },
        { $set: updateQuery },
        { new: true }
      );

      if (updated) {
        operationLogsList.push({ operationId: category.operationId, userId });
        result.applied.push({
          operationId: category.operationId,
          _id: updated._id.toString(),
        });
      } else {
        result.failed.push({ ...category, message: 'Category not found' });
      }
    } catch (error) {
      result.failed.push({ ...category, message: error.message });
    }
  }
}

export async function deleteCategories(
  categories,
  userId,
  result,
  operationLogsList
) {
  for (const category of categories) {
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
      result.applied.push({
        operationId: category.operationId,
        _id: categoryRecord._id.toString(),
      });
    } catch (error) {
      result.failed.push({ ...category, message: error.message });
    }
  }
}
