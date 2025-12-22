import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  completeHabit,
  createHabit,
  uncompleteHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));
router.post('/:id/complete', asyncHandler(completeHabit));
router.delete('/:id/complete', asyncHandler(uncompleteHabit));

export default router;
