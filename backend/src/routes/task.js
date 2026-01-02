import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask, updateTask } from '../controllers/taskController.js';
import {
  createTaskValidator,
  updateTaskValidator,
} from '../validators/validateTask.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.route('/').post(createTaskValidator, validate, asyncHandler(createTask));
router
  .route('/:id')
  .put(updateTaskValidator, validate, asyncHandler(updateTask));

export default router;
