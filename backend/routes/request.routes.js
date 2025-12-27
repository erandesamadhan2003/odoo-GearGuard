import express from 'express';
import {
    getAllRequests,
    getRequestById,
    createRequest,
    updateRequest,
    updateRequestStage,
    assignRequest,
    deleteRequest,
    getCalendarRequests,
    getMyRequests,
    getAssignedToMeRequests
} from '../controllers/request.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireManager, requireTechnician } from '../middleware/roleAuth.middleware.js';
import { validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get calendar view data
router.get('/calendar', getCalendarRequests);

// Get my requests (created by me)
router.get('/my-requests', getMyRequests);

// Get requests assigned to me
router.get('/assigned-to-me', getAssignedToMeRequests);

// Get all requests with filters
router.get('/', getAllRequests);

// Get request by ID
router.get('/:requestId', validateId('requestId'), getRequestById);

// Create request (all authenticated users)
router.post('/', createRequest);

// Update request stage (technicians and above)
router.patch('/:requestId/stage', requireTechnician, validateId('requestId'), updateRequestStage);

// Assign request to technician (managers and above)
router.patch('/:requestId/assign', requireManager, validateId('requestId'), assignRequest);

// Update request (creator or manager)
router.put('/:requestId', validateId('requestId'), updateRequest);

// Delete request (manager and above)
router.delete('/:requestId', requireManager, validateId('requestId'), deleteRequest);

export default router;