import { body } from 'express-validator';

export const createTaskValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title should be a string')
    .isLength({ min: 1, max: 30 })
    .withMessage(
      'The title length should be greater than 3 and less than 30 letter'
    )
    .trim(),

  body('description')
    .optional()
    .isString()
    .withMessage('Description should be string')
    .isLength({ min: 1, max: 200 })
    .withMessage('Description can be up to 200 characters')
    .trim(),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('DueDate must be a valid date')
    .toDate(),
];
