import express from 'express';

const router = express.Router();

/**
 * Root API endpoint
 * GET /
 */
router.get('/', (req, res) => {
  res.json({
    message: '🚀 GearGuard API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        googleAuth: 'GET /api/auth/google',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout'
      },
      users: {
        getAll: 'GET /api/users',
        getById: 'GET /api/users/:userId',
        update: 'PUT /api/users/:userId',
        delete: 'DELETE /api/users/:userId',
        getTechnicians: 'GET /api/users/technicians'
      },
      departments: {
        getAll: 'GET /api/departments',
        getById: 'GET /api/departments/:departmentId',
        create: 'POST /api/departments',
        update: 'PUT /api/departments/:departmentId',
        delete: 'DELETE /api/departments/:departmentId'
      },
      teams: {
        getAll: 'GET /api/teams',
        getById: 'GET /api/teams/:teamId',
        create: 'POST /api/teams',
        update: 'PUT /api/teams/:teamId',
        delete: 'DELETE /api/teams/:teamId',
        addMember: 'POST /api/teams/:teamId/members',
        removeMember: 'DELETE /api/teams/:teamId/members/:userId'
      },
      categories: {
        getAll: 'GET /api/categories',
        getById: 'GET /api/categories/:categoryId',
        create: 'POST /api/categories',
        update: 'PUT /api/categories/:categoryId',
        delete: 'DELETE /api/categories/:categoryId'
      },
      equipment: {
        getAll: 'GET /api/equipment',
        getById: 'GET /api/equipment/:equipmentId',
        create: 'POST /api/equipment',
        update: 'PUT /api/equipment/:equipmentId',
        delete: 'DELETE /api/equipment/:equipmentId',
        getRequests: 'GET /api/equipment/:equipmentId/requests',
        getByDepartment: 'GET /api/equipment/by-department/:departmentId'
      },
      requests: {
        getAll: 'GET /api/requests',
        getById: 'GET /api/requests/:requestId',
        create: 'POST /api/requests',
        update: 'PUT /api/requests/:requestId',
        updateStage: 'PATCH /api/requests/:requestId/stage',
        assign: 'PATCH /api/requests/:requestId/assign',
        delete: 'DELETE /api/requests/:requestId',
        calendar: 'GET /api/requests/calendar',
        myRequests: 'GET /api/requests/my-requests',
        assignedToMe: 'GET /api/requests/assigned-to-me'
      },
      dashboard: {
        stats: 'GET /api/dashboard/stats',
        overdue: 'GET /api/dashboard/overdue',
        requestsByTeam: 'GET /api/dashboard/reports/requests-by-team',
        requestsByCategory: 'GET /api/dashboard/reports/requests-by-category',
        requestsOverTime: 'GET /api/dashboard/requests-over-time',
        technicianPerformance: 'GET /api/dashboard/technician-performance'
      }
    }
  });
});

export default router;
