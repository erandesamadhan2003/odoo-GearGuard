import express from 'express';
import {
    getDashboardStats,
    getOverdueRequests,
    getRequestsByTeam,
    getRequestsByCategory,
    getRequestsOverTime,
    getTechnicianPerformance
} from '../controllers/dashboard.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireManager } from '../middleware/roleAuth.middleware.js';

const router = express.Router();

// All dashboard routes require authentication and manager role
router.use(authMiddleware);
router.use(requireManager);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get overdue requests
router.get('/overdue', getOverdueRequests);

// Get requests over time (for line charts)
router.get('/requests-over-time', getRequestsOverTime);

// Get technician performance
router.get('/technician-performance', getTechnicianPerformance);

// Get requests count by team (for reports/charts)
router.get('/reports/requests-by-team', getRequestsByTeam);

// Get requests count by category (for reports/charts)
router.get('/reports/requests-by-category', getRequestsByCategory);

export default router;