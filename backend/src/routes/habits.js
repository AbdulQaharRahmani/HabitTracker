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
  createHabitValidate,
  getHabitsByDateValidate,
  habitIdValidate,
  updateHabitValidate,
} from '../validations/validateHabit.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/', createHabitValidate, validate, asyncHandler(createHabit));
router.get('/', asyncHandler(getHabits));
router.get(
  '/date',
  getHabitsByDateValidate,
  validate,
  asyncHandler(getHabitsByDate)
);
router.post(
  '/:id/complete',
  habitIdValidate,
  validate,
  asyncHandler(completeHabit)
);
router.delete(
  '/:id/complete',
  habitIdValidate,
  validate,
  asyncHandler(uncompleteHabit)
);
router
  .route('/:id')
  .put(
    habitIdValidate,
    updateHabitValidate,
    validate,
    asyncHandler(updateHabit)
  )
  .delete(habitIdValidate, validate, asyncHandler(deleteHabit));

router.put('/reorder', asyncHandler(reorderHabits));

export default router;
