import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { createHabit, getHabits } from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));
router.get('/', asyncHandler(getHabits));

export default router;
