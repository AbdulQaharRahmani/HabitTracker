import { body } from 'express-validator';

export const createCategoryValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .isString()
    .withMessage('Name must be string')
    .isLength({ max: 25 })
    .withMessage('Maximum length for name is 25'),
  body('icon').optional().trim().isString().withMessage('Icon must be string'),
  body('backgroundColor')
    .optional()
    .trim()
    .isString()
    .withMessage('BackgroundColor must be string'),
];

export const updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .isString()
    .withMessage('Name must be string')
    .isLength({ max: 25 })
    .withMessage('Maximum length for name is 25'),
  body('icon').optional().isString().withMessage('Icon must be string').trim(),
  body('backgroundColor')
    .optional()
    .trim()
    .isString()
    .withMessage('BackgroundColor must be string'),
];
