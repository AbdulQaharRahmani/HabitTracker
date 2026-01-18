import express from 'express';
import { syncOfflineData } from '../controllers/syncController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/sync', asyncHandler(syncOfflineData));

export default router;
