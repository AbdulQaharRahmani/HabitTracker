import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { validate } from '../middleware/validate.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/validateCategory.js';
import { IdValidator } from '../validators/validateId.js';

const router = express.Router();

router.post(
  '/',
  createCategoryValidator,
  validate,
  asyncHandler(createCategory)
);

router
  .route('/:id')
  .put(
    IdValidator,
    updateCategoryValidator,
    validate,
    asyncHandler(updateCategory)
  )
  .delete(IdValidator, validate, asyncHandler(deleteCategory));

export default router;
