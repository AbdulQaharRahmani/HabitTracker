import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createTask,
  toggleTaskStatus,
  updateTask,
} from '../controllers/taskController.js';
import {
  createTaskValidator,
  updateTaskValidator,
} from '../validators/validateTask.js';
import { validate } from '../middleware/validate.js';
import { IdValidator } from '../validators/validateId.js';

const router = express.Router();

router.route('/').post(createTaskValidator, validate, asyncHandler(createTask));
router
  .route('/:id')
  .put(IdValidator, updateTaskValidator, validate, asyncHandler(updateTask));

router.patch(
  '/:id/status',
  IdValidator,
  validate,
  asyncHandler(toggleTaskStatus)
);
export default router;
