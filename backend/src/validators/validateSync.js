import { body } from 'express-validator';
import { createHabitValidator, updateHabitValidator } from './validateHabit.js';
import { createTaskValidator, updateTaskValidator } from './validateTask.js';
import { updateUserPreferenceValidator } from './validateUser.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
} from './validateCategory.js';

export const syncValidator = [
  body('lastSyncedServerTime')
    .optional()
    .isISO8601()
    .withMessage('lastSyncedServerTime must be a valid ISO 8601 date')
    .toDate(),

  body('operations')
    .isArray({ min: 1 })
    .withMessage('Operations must be an array with at least one operation'),

  body('operations.*.operationId')
    .notEmpty()
    .withMessage('operationId is required')
    .isUUID()
    .withMessage('operationId must be a valid UUID'),

  body('operations.*.type')
    .notEmpty()
    .withMessage('type is required')
    .isIn(['create', 'update', 'delete'])
    .withMessage('type must be create, update, or delete'),

  body('operations.*.entity')
    .notEmpty()
    .withMessage('entity is required')
    .isIn(['category', 'habit', 'task', 'userPreference', 'habitCompletion'])
    .withMessage(
      'entity must be category, habit, task, userPreference, or habitCompletion'
    ),

  // clientId is required for all except userPreference and habitCompletion
  body('operations.*.clientId')
    .if((value, { req, path }) => {
      const match = path.match(/^operations\[(\d+)\]\.clientId$/);
      if (!match) return false;
      const index = parseInt(match[1], 10);
      const entity = req.body.operations?.[index]?.entity;
      return entity && !['userPreference', 'habitCompletion'].includes(entity);
    })
    .notEmpty()
    .withMessage('clientId is required for offline entities')
    .isUUID()
    .withMessage('clientId must be a valid UUID'),

  // Payload validation
  body('operations.*.payload').custom(async (payload, { req, path }) => {
    const match = path.match(/^operations\[(\d+)\]\.payload$/);
    if (!match) throw new Error('Invalid operation path');
    const index = parseInt(match[1], 10);
    const operation = req.body.operations?.[index];
    if (!operation)
      throw new Error(`Operation at index ${index} is missing or invalid`);

    const { entity, type } = operation;

    if (!payload && type === 'delete') return true; // delete payload can be empty
    if (!payload) throw new Error('payload is required for create/update');

    switch (entity) {
      case 'category':
        if (type === 'create') {
          for (const validator of createCategoryValidator)
            await validator.run({ body: payload });
        } else if (type === 'update') {
          for (const validator of updateCategoryValidator)
            await validator.run({ body: payload });
        }
        break;

      case 'habit':
        if (type === 'create') {
          for (const validator of createHabitValidator)
            await validator.run({ body: payload });
        } else if (type === 'update') {
          for (const validator of updateHabitValidator)
            await validator.run({ body: payload });
        }
        break;

      case 'task':
        if (type === 'create') {
          for (const validator of createTaskValidator)
            await validator.run({ body: payload });
        } else if (type === 'update') {
          for (const validator of updateTaskValidator)
            await validator.run({ body: payload });
        }
        break;

      case 'habitCompletion':
        if (!payload.habitClientId && !payload.habitId) {
          throw new Error('HabitCompletion must have habitClientId or habitId');
        }
        if (!payload.date || isNaN(new Date(payload.date).getTime())) {
          throw new Error(
            'HabitCompletion date is required in UTC format and must be valid'
          );
        }
        break;

      case 'userPreference':
        for (const validator of updateUserPreferenceValidator)
          await validator.run({ body: payload });
        break;

      default:
        throw new Error('Unknown entity type');
    }

    return true;
  }),
];
