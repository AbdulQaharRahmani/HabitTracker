import express from 'express';
import { syncOfflineData } from '../controllers/syncController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { syncValidator } from '../validators/validateSync.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/sync', syncValidator, validate, asyncHandler(syncOfflineData));

export default router;
