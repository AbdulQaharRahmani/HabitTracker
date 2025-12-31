import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createTask } from '../controllers/taskController.js';

const router = express.Router();

router.route('/').post(asyncHandler(createTask));

export default router;
