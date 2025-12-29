import { body, param, query } from 'express-validator';

// Create a new Habit
export const createHabitValidate = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 3, max: 25 })
    .withMessage('Title must be between 3 and 25 characters')
    .trim(),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters')
    .trim(),

  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isIn([
      'daily',
      'every-other-day',
      'weekly',
      'biweekly',
      'weekdays',
      'weekends',
    ])
    .withMessage('Frequency must be one of the allowed values'),
];

// Update Habit
export const updateHabitValidate = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .trim(),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters')
    .trim(),

  body('frequency')
    .optional()
    .isIn([
      'daily',
      'every-other-day',
      'weekly',
      'biweekly',
      'weekdays',
      'weekends',
    ])
    .withMessage('Frequency must be one of the allowed values'),
];

// Get habits by date
export const getHabitsByDateValidate = [
  query('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be in YYYY-MM-DD format'),
];

// Habit ID validation (for routes like /habits/:id)
export const habitIdValidate = [
  param('id').isMongoId().withMessage('Invalid habitId'),
];
