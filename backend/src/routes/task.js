import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask, filterTasks } from '../controllers/taskController.js';
import { filterTasksValidator } from '../validators/validateTask.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.route('/').post(asyncHandler(createTask));
router.get(
  '/filter',
  filterTasksValidator,
  validate,
  asyncHandler(filterTasks)
);

export default router;
