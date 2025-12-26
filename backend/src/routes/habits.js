import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  completeHabit,
  createHabit,
  getHabits,
  getHabitsByDate,
  uncompleteHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

import mongoose from 'mongoose';

export const fakeAuth = (req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('694d834a6b1f3c91e94d060c'),
  };

  next();
};

router.post('/', fakeAuth, asyncHandler(createHabit));
router.get('/', fakeAuth, asyncHandler(getHabits));
router.get('/date', fakeAuth, asyncHandler(getHabitsByDate));
router.post('/:id/complete', asyncHandler(completeHabit));
router.delete('/:id/complete', asyncHandler(uncompleteHabit));

export default router;
