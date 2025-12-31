import { body, param, query } from 'express-validator';

const frequency = [
  'daily',
  'every-other-day',
  'weekly',
  'biweekly',
  'weekdays',
  'weekends',
];
// Create a new Habit
export const createHabitValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ min: 1, max: 25 })
    .withMessage('Title must be between 1 and 25 characters'),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 255 })
    .withMessage('Description max length is 255 characters'),

  body('frequency')
    .notEmpty()
    .withMessage('Frequency is required')
    .isIn(frequency)
    .withMessage(`Frequency must be one of the allowed values : ${frequency}`),
];

// Update Habit
export const updateHabitValidator = [
  body('title')
    .optional()
    .trim()
    .isString()
    .withMessage('Title must be a string'),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 255 })
    .withMessage('Description max length is 255 characters'),

  body('frequency')
    .optional()
    .isIn(frequency)
    .withMessage(`Frequency must be one of the allowed values ${frequency}`),
];

// Get habits by date
export const getHabitsByDateValidator = [
  query('date')
    .optional()
    .isISO8601() // Check valid date format (YYYY-MM-DD)
    .withMessage('Date must be in YYYY-MM-DD format'),
];

// Habit ID validation (for routes like /habits/:id)
export const habitIdValidator = [
  param('id')
    .isMongoId() //Check validates MongoDB id format
    .withMessage('Invalid habitId'),
];
