import { body } from 'express-validator';
import { DateHelper } from '../utils/date.js';

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

export const updateUserPreferenceValidator = [
  body('weekStartDay')
    .optional()
    .trim()
    .toLowerCase()
    .isIn([
      'saturday',
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
    ])
    .withMessage('weekStartDay must be a valid weekday'),
  body('dailyReminderTime')
    .optional()
    .trim()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('dailyReminderTime must be in HH:mm 24-hour format'),
  body('timezone')
    .optional()
    .trim()
    .toLowerCase()
    .isIn([...Object.keys(DateHelper.TIMEZONES)])
    .withMessage('Invalid Timezone'),
  body('theme')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(['light', 'dark', 'system'])
    .withMessage('Invalid Theme'),
  body('dailyReminderEnabled')
    .optional()
    .isBoolean()
    .withMessage('dailyReminderEnabled should be boolean'),
  body('streakAlertEnabled')
    .optional()
    .isBoolean()
    .withMessage('streakAlertEnabled should be boolean'),
  body('weeklySummaryEmailEnabled')
    .optional()
    .isBoolean()
    .withMessage('weeklySummaryEmailEnabled should be boolean'),
];
