import { body } from 'express-validator';

export const registerValidator = [
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

export const updateUsernameValidator = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .isLength({ min: 1, max: 30 })
    .withMessage(
      'The username length should be greater than 1 and less than 30 letter'
    )
    .trim(),
];
