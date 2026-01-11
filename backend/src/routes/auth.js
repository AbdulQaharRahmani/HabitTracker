import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  loginUser,
  registerUser,
  redirectToGoogleAuth,
  handleGoogleCallback,
} from '../controllers/authController.js';
import {
  loginValidator,
  registerValidator,
} from '../validators/validateUser.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/register',
  registerValidator,
  validate,
  asyncHandler(registerUser)
);
router.post('/login', loginValidator, validate, asyncHandler(loginUser));

//Google routes
router.get('/google', asyncHandler(redirectToGoogleAuth));
router.get('/google/callback', asyncHandler(handleGoogleCallback));

export default router;
