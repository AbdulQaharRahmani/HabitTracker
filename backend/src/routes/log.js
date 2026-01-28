import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getLogStats, getLogs } from '../controllers/logController.js';

const router = express.Router();

router.get('/', asyncHandler(getLogs));
router.get('/log-stats', asyncHandler(getLogStats));

export default router;
