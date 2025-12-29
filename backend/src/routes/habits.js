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
import { authenticationToken } from '../middleware/authMiddleware.js';
import {
  createHabitValidate,
  getHabitsByDateValidate,
  habitIdValidate,
  updateHabitValidate,
} from '../validations/validateHabit.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  authenticationToken,
  createHabitValidate,
  validate,
  asyncHandler(createHabit)
);
router.get('/', authenticationToken, asyncHandler(getHabits));
router.get(
  '/date',
  authenticationToken,
  getHabitsByDateValidate,
  validate,
  asyncHandler(getHabitsByDate)
);
router.post(
  '/:id/complete',
  authenticationToken,
  habitIdValidate,
  validate,
  asyncHandler(completeHabit)
);
router.delete(
  '/:id/complete',
  authenticationToken,
  habitIdValidate,
  validate,
  asyncHandler(uncompleteHabit)
);

router
  .route('/:id')
  .put(
    authenticationToken,
    habitIdValidate,
    updateHabitValidate,
    validate,
    asyncHandler(updateHabit)
  )
  .delete(
    authenticationToken,
    habitIdValidate,
    validate,
    asyncHandler(deleteHabit)
  );

router.put('/reorder', authenticationToken, asyncHandler(reorderHabits));

export default router;
