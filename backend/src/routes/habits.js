import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  completeHabit,
  createHabit,
  getHabits,
  uncompleteHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

import mongoose from 'mongoose';

export const fakeAuth = (req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('694d177e9c791573bbaf5824'),
  };

  next();
};

router.post('/', fakeAuth, asyncHandler(createHabit));
router.get('/', fakeAuth, asyncHandler(getHabits));
router.post('/:id/complete', asyncHandler(completeHabit));
router.delete('/:id/complete', asyncHandler(uncompleteHabit));

export default router;
