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

// A fake middleware, will delete it after authMiddleware create
import mongoose from 'mongoose';
const auth = (req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId('694c1e9da83cd8cfd3ae6d9b'),
  };
  next();
};
// ---------------

router.post('/', auth, asyncHandler(createHabit));
router.post('/:id/complete', auth, asyncHandler(completeHabit));
router.delete('/:id/complete', auth, asyncHandler(uncompleteHabit));
router.get('/', auth, asyncHandler(getHabits));

router
  .route('/:id')
  .put(auth, asyncHandler(updateHabit))
  .delete(auth, asyncHandler(deleteHabit));

export default router;
