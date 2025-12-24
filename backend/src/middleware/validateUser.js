import { body, validationResult } from "express-validator";
import { AppError } from '../../utils/error.js';

export const registerValidate = [
    body('email')
    .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters')
        .isAlphanumeric()
        .withMessage('Password must contain only letters and numbers')
        .trim(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new AppError( errors.array()[0].msg, 400 )
        }
        next();
    }
]

export const loginValidate = [
    body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email'),
    body('password')
    .notEmpty().withMessage('Password is required')
    .trim(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new AppError( errors.array()[0].msg, 400 )
        }
        next();
    }
]