import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllTechnicians
} from '../controllers/user.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireManager, requireAdmin } from '../middleware/roleAuth.middleware.js';
import { validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all technicians
router.get('/technicians', getAllTechnicians);

// Get all users (Manager/Admin only)
router.get('/', requireManager, getAllUsers);

// Get user by ID
router.get('/:userId', validateId('userId'), getUserById);

// Update user
router.put('/:userId', validateId('userId'), updateUser);

// Delete user (Admin only)
router.delete('/:userId', requireAdmin, validateId('userId'), deleteUser);

export default router;
