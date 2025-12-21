import express from 'express';
import { getHabits } from '../controllers/habitsController.js';

const router = express.Router();

router.route('/').get(getHabits);

export default router;
