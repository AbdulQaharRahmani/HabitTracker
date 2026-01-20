import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createHabit,
  deleteHabit,
  getHabits,
  getHabitsByDate,
  updateHabit,
  reorderHabits,
  completeHabit,
  uncompleteHabit,
} from '../controllers/habitsController.js';
import {
  createHabitValidator,
  getHabitsByDateValidator,
  habitIdValidator,
  updateHabitValidator,
} from '../validators/validateHabit.js';
import { validate } from '../middleware/validate.js';
import {
  getHabitChartData,
  getHabitsDashboard,
} from '../controllers/habitDashboardController.js';

const router = express.Router();

router.post('/', createHabitValidator, validate, asyncHandler(createHabit));
router.get('/', asyncHandler(getHabits));
router.get(
  '/date',
  getHabitsByDateValidator,
  validate,
  asyncHandler(getHabitsByDate)
);
router.post(
  '/:id/complete',
  habitIdValidator,
  validate,
  asyncHandler(completeHabit)
);
router.delete(
  '/:id/complete',
  habitIdValidator,
  validate,
  asyncHandler(uncompleteHabit)
);
router
  .route('/:id')
  .put(
    habitIdValidator,
    updateHabitValidator,
    validate,
    asyncHandler(updateHabit)
  )
  .delete(habitIdValidator, validate, asyncHandler(deleteHabit));

router.put('/reorder', asyncHandler(reorderHabits));

router.get('/dashboard', asyncHandler(getHabitsDashboard));
router.get('/dashboard/chart-data', asyncHandler(getHabitChartData));

export default router;
