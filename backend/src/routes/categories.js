import express from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', asyncHandler(createCategory));
router
  .route('/:id')
  .put(asyncHandler(updateCategory))
  .delete(asyncHandler(deleteCategory));

export default router;
