import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getLogs } from '../controllers/logController.js';

const router = express.Router();

router.get('/logs', asyncHandler(getLogs));

export default router;
