import express from 'express';
import { changePassword } from '../controllers/userController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { changePasswordValidator } from '../validators/validateUser.js';

const router = express.Router();

router.patch(
  '/changePassword',
  changePasswordValidator,
  validate,
  asyncHandler(changePassword)
);

export default router;
