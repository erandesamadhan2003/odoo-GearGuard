import { MaintenanceRequest, Equipment, EquipmentCategory, MaintenanceTeam, User, RequestHistory } from '../models/index.js';
import { Op } from 'sequelize';

// Get all requests with filters
export const getAllRequests = async (req, res) => {
    try {
        const { stage, priority, requestType, equipmentId, teamId, assignedToUserId } = req.query;
        
        const where = {};
        if (stage) where.stage = stage;
        if (priority) where.priority = priority;
        if (requestType) where.requestType = requestType;
        if (equipmentId) where.equipmentId = equipmentId;
        if (teamId) where.maintenanceTeamId = teamId;
        if (assignedToUserId) where.assignedToUserId = assignedToUserId;

        const requests = await MaintenanceRequest.findAll({
            where,
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentId', 'equipmentName', 'serialNumber']
                },
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryId', 'categoryName']
                },
                {
                    model: MaintenanceTeam,
                    as: 'maintenanceTeam',
                    attributes: ['teamId', 'teamName']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['userId', 'fullName', 'email']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['userId', 'fullName', 'email'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Get all requests error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch requests'
        });
    }
};

// Get request by ID
export const getRequestById = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await MaintenanceRequest.findByPk(requestId, {
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentId', 'equipmentName', 'serialNumber']
                },
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryId', 'categoryName']
                },
                {
                    model: MaintenanceTeam,
                    as: 'maintenanceTeam',
                    attributes: ['teamId', 'teamName']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['userId', 'fullName', 'email']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['userId', 'fullName', 'email'],
                    required: false
                },
                {
                    model: RequestHistory,
                    as: 'history',
                    include: [
                        {
                            model: User,
                            as: 'changedBy',
                            attributes: ['userId', 'fullName']
                        }
                    ],
                    order: [['changedAt', 'DESC']]
                }
            ]
        });

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            request
        });
    } catch (error) {
        console.error('Get request by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch request'
        });
    }
};

// Create request
export const createRequest = async (req, res) => {
    try {
        const {
            subject,
            description,
            equipmentId,
            categoryId,
            maintenanceTeamId,
            requestType,
            priority,
            scheduledDate
        } = req.body;

        if (!subject || !equipmentId || !categoryId || !maintenanceTeamId || !requestType) {
            return res.status(400).json({
                success: false,
                message: 'Subject, equipment, category, team, and request type are required'
            });
        }

        const request = await MaintenanceRequest.create({
            subject,
            description,
            equipmentId,
            categoryId,
            maintenanceTeamId,
            requestType,
            priority: priority || 'medium',
            scheduledDate,
            createdByUserId: req.user.id,
            stage: 'new'
        });

        res.status(201).json({
            success: true,
            message: 'Request created successfully',
            request
        });
    } catch (error) {
        console.error('Create request error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create request'
        });
    }
};

// Update request
export const updateRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const updateData = req.body;

        const request = await MaintenanceRequest.findByPk(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        // Check if user is creator or manager/admin
        if (req.user.role !== 'admin' && req.user.role !== 'manager' && request.createdByUserId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own requests'
            });
        }

        await request.update(updateData);

        res.json({
            success: true,
            message: 'Request updated successfully',
            request
        });
    } catch (error) {
        console.error('Update request error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update request'
        });
    }
};

// Update request stage
export const updateRequestStage = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { stage, notes, durationHours } = req.body;

        if (!stage) {
            return res.status(400).json({
                success: false,
                message: 'Stage is required'
            });
        }

        const validStages = ['new', 'in_progress', 'repaired', 'scrapped'];
        if (!validStages.includes(stage)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stage'
            });
        }

        const request = await MaintenanceRequest.findByPk(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        const oldStage = request.stage;
        const updateData = { stage };
        
        if (notes) updateData.notes = notes;
        if (durationHours) updateData.durationHours = durationHours;
        
        if (stage === 'repaired' || stage === 'scrapped') {
            updateData.completedDate = new Date();
            if (!request.assignedToUserId) {
                updateData.assignedToUserId = req.user.id;
            }
        }

        await request.update(updateData);

        // Create history entry
        await RequestHistory.create({
            requestId,
            changedByUserId: req.user.id,
            oldStage,
            newStage: stage,
            notes: notes || `Stage changed from ${oldStage} to ${stage}`,
            changedAt: new Date()
        });

        res.json({
            success: true,
            message: 'Request stage updated successfully',
            request
        });
    } catch (error) {
        console.error('Update request stage error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update request stage'
        });
    }
};

// Assign request to technician
export const assignRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { assignedToUserId } = req.body;

        if (!assignedToUserId) {
            return res.status(400).json({
                success: false,
                message: 'User ID to assign is required'
            });
        }

        const request = await MaintenanceRequest.findByPk(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        const user = await User.findByPk(assignedToUserId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const oldAssignedTo = request.assignedToUserId;
        await request.update({ 
            assignedToUserId,
            stage: request.stage === 'new' ? 'in_progress' : request.stage
        });

        // Create history entry
        await RequestHistory.create({
            requestId,
            changedByUserId: req.user.id,
            oldAssignedTo,
            newAssignedTo: assignedToUserId,
            notes: `Request assigned to ${user.fullName}`,
            changedAt: new Date()
        });

        res.json({
            success: true,
            message: 'Request assigned successfully',
            request
        });
    } catch (error) {
        console.error('Assign request error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to assign request'
        });
    }
};

// Delete request
export const deleteRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const request = await MaintenanceRequest.findByPk(requestId);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        await request.destroy();

        res.json({
            success: true,
            message: 'Request deleted successfully'
        });
    } catch (error) {
        console.error('Delete request error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete request'
        });
    }
};

// Get calendar requests
export const getCalendarRequests = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const where = {};
        if (startDate && endDate) {
            where.scheduledDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const requests = await MaintenanceRequest.findAll({
            where,
            attributes: ['requestId', 'subject', 'scheduledDate', 'priority', 'stage'],
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentName']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['userId', 'fullName'],
                    required: false
                }
            ],
            order: [['scheduledDate', 'ASC']]
        });

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Get calendar requests error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch calendar requests'
        });
    }
};

// Get my requests (created by current user)
export const getMyRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.findAll({
            where: { createdByUserId: req.user.id },
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentId', 'equipmentName', 'serialNumber']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['userId', 'fullName', 'email'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Get my requests error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch requests'
        });
    }
};

// Get requests assigned to me
export const getAssignedToMeRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.findAll({
            where: { assignedToUserId: req.user.id },
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentId', 'equipmentName', 'serialNumber']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['userId', 'fullName', 'email']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Get assigned to me requests error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch requests'
        });
    }
};
