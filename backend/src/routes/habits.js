import express from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

router.post('/', asyncHandler(createHabit));
router.get('/', asyncHandler(getHabits));

router
  .route('/:id')
  .put(asyncHandler(updateHabit))
  .delete(asyncHandler(deleteHabit));

export default router;
