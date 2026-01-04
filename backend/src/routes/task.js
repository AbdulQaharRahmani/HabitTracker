import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask, toggleTaskStatus } from '../controllers/taskController.js';
import { IdValidator } from '../validators/validateId.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.route('/').post(asyncHandler(createTask));
router.patch(
  '/:id/status',
  IdValidator,
  validate,
  asyncHandler(toggleTaskStatus)
);

export default router;
