import express from 'express';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';
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

export default router;
