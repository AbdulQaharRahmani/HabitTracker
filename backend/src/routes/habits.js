import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createHabit,
  deleteHabit,
  getHabits,
  updateHabit,
  completeHabit,
  uncompleteHabit,
} from '../controllers/habitsController.js';

const router = express.Router();

import mongoose from 'mongoose';

const auth = (req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('694c1e9da83cd8cfd3ae6d9b'),
  };
  next();
};

router.post('/', auth, asyncHandler(createHabit));
router.post('/:id/complete', asyncHandler(completeHabit));
router.delete('/:id/complete', asyncHandler(uncompleteHabit));
router.get('/', auth, asyncHandler(getHabits));

router
  .route('/:id')
  .put(asyncHandler(updateHabit))
  .delete(asyncHandler(deleteHabit));

export default router;
