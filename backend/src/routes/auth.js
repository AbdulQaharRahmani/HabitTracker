import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getProfilePicture,
  loginUser,
  registerUser,
  uploadProfilePicture,
} from '../controllers/authController.js';
import { loginValidate, registerValidate } from '../middleware/validateUser.js';

const router = express.Router();

router.post('/register', registerValidate, asyncHandler(registerUser));
router.post('/login', loginValidate, asyncHandler(loginUser));
router.post('/profile-picture', asyncHandler(uploadProfilePicture));
router.get('/profile-picture', asyncHandler(getProfilePicture));

export default router;
