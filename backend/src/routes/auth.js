import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  loginUser,
  registerUser,
  googleLogin,
  refreshAccessToken,
  logOutUser,
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
router.post('/google', asyncHandler(googleLogin));

router.post('/refresh', asyncHandler(refreshAccessToken));
router.post('/logout', asyncHandler(logOutUser));
export default router;
