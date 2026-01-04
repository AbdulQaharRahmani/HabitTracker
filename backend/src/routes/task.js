import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask, getTasks } from '../controllers/taskController.js';

const router = express.Router();

router.route('/').post(asyncHandler(createTask)).get(asyncHandler(getTasks));

export default router;
