import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask, getTaskLists } from '../controllers/taskController.js';

const router = express.Router();

router
  .route('/')
  .post(asyncHandler(createTask))
  .get(asyncHandler(getTaskLists));

export default router;
