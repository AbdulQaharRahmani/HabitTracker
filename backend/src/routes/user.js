import express from 'express';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  changePassword,
  updateUsername,
} from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordValidator,
  updateUsernameValidator,
} from '../validators/validateUser.js';
import {
  getProfilePicture,
  uploadProfilePicture,
} from '../controllers/userController.js';

const router = express.Router();

router.post(
  '/profile-picture',
  upload.single('profilePicture'),
  asyncHandler(uploadProfilePicture)
);
router.get('/:id/profile-picture', asyncHandler(getProfilePicture));

router.patch(
  '/changePassword',
  changePasswordValidator,
  validate,
  asyncHandler(changePassword)
);

router.patch(
  '/username',
  updateUsernameValidator,
  validate,
  asyncHandler(updateUsername)
);

export default router;
