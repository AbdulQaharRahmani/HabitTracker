import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
} from '../controllers/categoryController.js';
import { validate } from '../middleware/validate.js';
import {
  createCategoryValidator,
  updateCategoryValidator,
} from '../validators/validateCategory.js';
import { IdValidator } from '../validators/validateId.js';

const router = express.Router();

router
  .route('/')
  .post(createCategoryValidator, validate, asyncHandler(createCategory))
  .get(asyncHandler(getCategories));

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
