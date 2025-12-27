import express from 'express';
import {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/category.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireManager } from '../middleware/roleAuth.middleware.js';
import { validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all categories
router.get('/', getAllCategories);

// Get category by ID
router.get('/:categoryId', validateId('categoryId'), getCategoryById);

// Create category (Manager/Admin only)
router.post('/', requireManager, createCategory);

// Update category (Manager/Admin only)
router.put('/:categoryId', requireManager, validateId('categoryId'), updateCategory);

// Delete category (Manager/Admin only)
router.delete('/:categoryId', requireManager, validateId('categoryId'), deleteCategory);

export default router;
