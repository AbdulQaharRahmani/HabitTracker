import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  loginUser,
  registerUser,
  googleLogin,
  refreshAccessToken,
  logOutUser,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import {
  loginValidator,
  registerValidator,
  resetPasswordValidator,
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
router.post('/forgotPassword', asyncHandler(forgotPassword));
router.put(
  '/resetPassword/:resetToken',
  resetPasswordValidator,
  validate,
  asyncHandler(resetPassword)
);

//Google routes
router.post('/google', asyncHandler(googleLogin));

router.post('/refresh', asyncHandler(refreshAccessToken));
router.post('/logout', asyncHandler(logOutUser));

export default router;
