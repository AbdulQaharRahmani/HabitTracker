import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  completeHabit,
  createHabit,
  getHabits,
  uncompleteHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));
router.post('/:id/complete', asyncHandler(completeHabit));
router.delete('/:id/complete', asyncHandler(uncompleteHabit));
router.get('/', asyncHandler(getHabits));

export default router;
