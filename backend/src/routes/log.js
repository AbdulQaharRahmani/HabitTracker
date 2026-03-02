import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getLogById,
  getLogStats,
  getLogs,
} from '../controllers/logController.js';

const router = express.Router();

router.get('/log-stats', asyncHandler(getLogStats));
router.get('/:id', asyncHandler(getLogById));
router.get('/', asyncHandler(getLogs));

export default router;
