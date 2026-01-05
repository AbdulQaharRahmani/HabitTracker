import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createTask,
  toggleTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';
import { createTaskValidator } from '../validators/validateTask.js';
import { validate } from '../middleware/validate.js';
import { IdValidator } from '../validators/validateId.js';

const router = express.Router();

router.route('/').post(createTaskValidator, validate, asyncHandler(createTask));
router.route('/:id').delete(IdValidator, validate, asyncHandler(deleteTask));
router.patch(
  '/:id/status',
  IdValidator,
  validate,
  asyncHandler(toggleTaskStatus)
);

export default router;
