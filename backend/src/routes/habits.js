import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createHabit,
  getHabits,
  reorderHabits,
} from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));
router.get('/', asyncHandler(getHabits));
router.put('/reorder', asyncHandler(reorderHabits));
export default router;
