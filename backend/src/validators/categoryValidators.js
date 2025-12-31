import { body } from 'express-validator';

export const categoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be string')
    .isLength({ max: 25 })
    .withMessage('Maximum length for name is 25'),
  body('icon').optional().isString().withMessage('Icon must be string').trim(),
  body('backgroundColor')
    .optional()
    .isString()
    .withMessage('BackgroundColor must be string'),
];
