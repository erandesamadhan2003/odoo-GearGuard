import { MaintenanceTeam, User, TeamMember } from '../models/index.js';

// Get all teams
export const getAllTeams = async (req, res) => {
    try {
        const teams = await MaintenanceTeam.findAll({
            include: [
                {
                    model: User,
                    as: 'members',
                    through: { 
                        attributes: ['isLead', 'joinedAt'],
                        as: 'teamMember'
                    },
                    attributes: ['userId', 'fullName', 'email', 'role']
                }
            ],
            order: [['teamName', 'ASC']]
        });

        res.json({
            success: true,
            teams
        });
    } catch (error) {
        console.error('Get all teams error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch teams'
        });
    }
};

// Get team by ID
export const getTeamById = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await MaintenanceTeam.findByPk(teamId, {
            include: [
                {
                    model: User,
                    as: 'members',
                    through: { 
                        attributes: ['isLead', 'joinedAt'],
                        as: 'teamMember'
                    },
                    attributes: ['userId', 'fullName', 'email', 'role']
                }
            ]
        });

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        res.json({
            success: true,
            team
        });
    } catch (error) {
        console.error('Get team by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch team'
        });
    }
};

// Create team
export const createTeam = async (req, res) => {
    try {
        const { teamName, description } = req.body;

        if (!teamName) {
            return res.status(400).json({
                success: false,
                message: 'Team name is required'
            });
        }

        const team = await MaintenanceTeam.create({
            teamName,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            team
        });
    } catch (error) {
        console.error('Create team error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Team name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create team'
        });
    }
};

// Update team
export const updateTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { teamName, description } = req.body;

        const team = await MaintenanceTeam.findByPk(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        await team.update({
            ...(teamName && { teamName }),
            ...(description !== undefined && { description })
        });

        res.json({
            success: true,
            message: 'Team updated successfully',
            team
        });
    } catch (error) {
        console.error('Update team error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Team name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update team'
        });
    }
};

// Delete team
export const deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        const team = await MaintenanceTeam.findByPk(teamId);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        await team.destroy();

        res.json({
            success: true,
            message: 'Team deleted successfully'
        });
    } catch (error) {
        console.error('Delete team error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete team'
        });
    }
};

// Add member to team
export const addTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId, isLead = false } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const team = await MaintenanceTeam.findByPk(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is already a member
        const existingMember = await TeamMember.findOne({
            where: { teamId, userId }
        });

        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: 'User is already a member of this team'
            });
        }

        await TeamMember.create({
            teamId,
            userId,
            isLead,
            joinedAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: 'Member added to team successfully'
        });
    } catch (error) {
        console.error('Add team member error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add team member'
        });
    }
};

// Remove member from team
export const removeTeamMember = async (req, res) => {
    try {
        const { teamId, userId } = req.params;

        const teamMember = await TeamMember.findOne({
            where: { teamId, userId }
        });

        if (!teamMember) {
            return res.status(404).json({
                success: false,
                message: 'Team member not found'
            });
        }

        await teamMember.destroy();

        res.json({
            success: true,
            message: 'Member removed from team successfully'
        });
    } catch (error) {
        console.error('Remove team member error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to remove team member'
        });
    }
};
