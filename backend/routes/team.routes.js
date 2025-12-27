import express from 'express';
import {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember
} from '../controllers/team.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { requireManager } from '../middleware/roleAuth.middleware.js';
import { validateId } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all teams
router.get('/', getAllTeams);

// Get team by ID
router.get('/:teamId', validateId('teamId'), getTeamById);

// Create team (Manager/Admin only)
router.post('/', requireManager, createTeam);

// Update team (Manager/Admin only)
router.put('/:teamId', requireManager, validateId('teamId'), updateTeam);

// Delete team (Manager/Admin only)
router.delete('/:teamId', requireManager, validateId('teamId'), deleteTeam);

// Add member to team (Manager/Admin only)
router.post('/:teamId/members', requireManager, validateId('teamId'), addTeamMember);

// Remove member from team (Manager/Admin only)
router.delete('/:teamId/members/:userId', requireManager, validateId('teamId'), validateId('userId'), removeTeamMember);

export default router;
