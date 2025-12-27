import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
  reorderHabits,
  completeHabit,
  uncompleteHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));
router.post('/:id/complete', asyncHandler(completeHabit));
router.delete('/:id/complete', asyncHandler(uncompleteHabit));
router.get('/', asyncHandler(getHabits));

router
  .route('/:id')
  .put(asyncHandler(updateHabit))
  .delete(asyncHandler(deleteHabit));

router.put('/reorder', asyncHandler(reorderHabits));
export default router;
