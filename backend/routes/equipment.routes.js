import express from 'express';
import {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getEquipmentRequests,
    getEquipmentByDepartment
} from '../controllers/equipment.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireManager } from '../middleware/roleAuth.middleware.js';
import { validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all equipment
router.get('/', getAllEquipment);

// Get equipment by department
router.get('/by-department/:departmentId', validateId('departmentId'), getEquipmentByDepartment);

// Get equipment by ID
router.get('/:equipmentId', validateId('equipmentId'), getEquipmentById);

// Get equipment requests
router.get('/:equipmentId/requests', validateId('equipmentId'), getEquipmentRequests);

// Create equipment (Manager/Admin only)
router.post('/', requireManager, createEquipment);

// Update equipment (Manager/Admin only)
router.put('/:equipmentId', requireManager, validateId('equipmentId'), updateEquipment);

// Delete equipment (Manager/Admin only)
router.delete('/:equipmentId', requireManager, validateId('equipmentId'), deleteEquipment);

export default router;
