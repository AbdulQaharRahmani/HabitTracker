import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createTask,
  filterTasks,
  toggleTaskStatus,
} from '../controllers/taskController.js';
import { filterTasksValidator } from '../validators/validateTask.js';
import { IdValidator } from '../validators/validateId.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.route('/').post(asyncHandler(createTask));
router.get(
  '/filter',
  filterTasksValidator,
  validate,
  asyncHandler(filterTasks)
);
router.patch(
  '/:id/status',
  IdValidator,
  validate,
  asyncHandler(toggleTaskStatus)
);

export default router;
