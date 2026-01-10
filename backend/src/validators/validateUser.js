import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString('Username should be string')
    .isLength({ max: 25 })
    .trim(),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 characters')
    .isAlphanumeric()
    .withMessage('Password must contain only letters and numbers')
    .trim(),
];

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required').trim(),
];

export const changePasswordValidator = [
  body('oldPassword').notEmpty().withMessage('Old password is required').trim(),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 5 })
    .withMessage('New password must be at least 5 characters')
    .isAlphanumeric()
    .withMessage('New password must contain only letters and numbers')
    .trim(),
];
