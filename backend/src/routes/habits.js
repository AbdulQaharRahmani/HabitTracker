import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createHabit } from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));

export default router;
