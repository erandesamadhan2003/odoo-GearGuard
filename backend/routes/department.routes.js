import express from 'express';
import {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/department.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireManager } from '../middleware/roleAuth.middleware.js';
import { validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all departments
router.get('/', getAllDepartments);

// Get department by ID
router.get('/:departmentId', validateId('departmentId'), getDepartmentById);

// Create department (Manager/Admin only)
router.post('/', requireManager, createDepartment);

// Update department (Manager/Admin only)
router.put('/:departmentId', requireManager, validateId('departmentId'), updateDepartment);

// Delete department (Manager/Admin only)
router.delete('/:departmentId', requireManager, validateId('departmentId'), deleteDepartment);

export default router;