import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { loginUser, registerUser } from '../controllers/authController.js';
import { loginValidate, registerValidate } from '../middleware/validateUser.js';

const router = express.Router();

router.post('/register', registerValidate, asyncHandler(registerUser));
router.post('/login', loginValidate, asyncHandler(loginUser));

export default router;