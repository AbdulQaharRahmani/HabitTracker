import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { categoryValidator } from '../validators/categoryValidators.js';
import { validate } from '../middleware/validate.js';
import { IdValidator } from '../validators/IdValidator.js';

const router = express.Router();

router.post('/', categoryValidator, validate, asyncHandler(createCategory));

router
  .route('/:id')
  .put(IdValidator, categoryValidator, validate, asyncHandler(updateCategory))
  .delete(IdValidator, validate, asyncHandler(deleteCategory));

export default router;
