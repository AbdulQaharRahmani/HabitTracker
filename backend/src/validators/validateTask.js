import { body, query } from 'express-validator';

export const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title should be a string')
    .isLength({ min: 1, max: 30 })
    .withMessage(
      'The title length should be greater than 1 and less than 30 letter'
    )
    .trim(),

  body('description')
    .optional()
    .isString()
    .withMessage('Description should be string')
    .isLength({ max: 200 })
    .withMessage('Description can be up to 200 characters')
    .trim(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('status')
    .optional()
    .isIn(['todo', 'done'])
    .withMessage('Status must be todo or done'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('DueDate must be a valid date')
    .toDate(),
];

export const updateTaskValidator = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title should be a string')
    .isLength({ min: 1, max: 30 })
    .withMessage(
      'The title length should be greater than 1 and less than 30 letter'
    )
    .trim(),

  body('description')
    .optional()
    .isString()
    .withMessage('Description should be string')
    .isLength({ max: 200 })
    .withMessage('Description can be up to 200 characters')
    .trim(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('status')
    .optional()
    .isIn(['todo', 'done'])
    .withMessage('Status must be todo or done'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('DueDate must be a valid date')
    .toDate(),
];

export const filterTasksValidator = [
  query('searchTerm')
    .optional()
    .isString()
    .withMessage('Search Term should be a string')
    .trim(),

  query('status')
    .optional()
    .isString()
    .withMessage('Status should be string')
    .trim(),

  query('priority')
    .optional()
    .isString()
    .withMessage('Priority should be string')
    .trim(),

  query('dueDate')
    .optional()
    .isISO8601()
    .withMessage('DueDate must be a valid date')
    .toDate(),
];
