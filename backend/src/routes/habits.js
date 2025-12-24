import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createHabit, getHabits } from '../controllers/habitsController.js';
import mongoose from 'mongoose';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  req.user = { _id: new mongoose.Types.ObjectId('64f1a1c9a1f4b5d123456788') };
  next();
};

router.post('/', asyncHandler(createHabit));
router.get('/', authMiddleware, asyncHandler(getHabits));

export default router;
