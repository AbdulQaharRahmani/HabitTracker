import express from 'express';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  changePassword,
  updateUsername,
  getUserPreference,
  updateUserPreference,
} from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import {
  changePasswordValidator,
  updateUsernameValidator,
  updateUserPreferenceValidator,
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
router
  .route('/preference')
  .get(asyncHandler(getUserPreference))
  .put(
    updateUserPreferenceValidator,
    validate,
    asyncHandler(updateUserPreference)
  );

export default router;
