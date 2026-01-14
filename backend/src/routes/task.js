import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createTask,
  getTasks,
  filterTasks,
  toggleTaskStatus,
  deleteTask,
  updateTask,
} from '../controllers/taskController.js';
import {
  createTaskValidator,
  updateTaskValidator,
  filterTasksValidator,
} from '../validators/validateTask.js';
import { validate } from '../middleware/validate.js';
import { IdValidator } from '../validators/validateId.js';

const router = express.Router();

router.get(
  '/filter',
  filterTasksValidator,
  validate,
  asyncHandler(filterTasks)
);
router
  .route('/')
  .post(createTaskValidator, validate, asyncHandler(createTask))
  .get(asyncHandler(getTasks));
router.route('/:id').delete(IdValidator, validate, asyncHandler(deleteTask));
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
