import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createHabit,
  getHabits,
  getHabitsByDate,
  reorderHabits,
  completeHabit,
  uncompleteHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));
router.get('/', asyncHandler(getHabits));
router.get('/date', asyncHandler(getHabitsByDate));
router.post('/:id/complete', asyncHandler(completeHabit));
router.delete('/:id/complete', asyncHandler(uncompleteHabit));
router.put('/reorder', asyncHandler(reorderHabits));

export default router;
