import { MaintenanceRequest, Equipment, MaintenanceTeam, EquipmentCategory, User } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';
import { checkOverdue } from '../utils/helpers.js';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Total requests
        const totalRequests = await MaintenanceRequest.count();

        // Requests by stage
        const requestsByStage = await MaintenanceRequest.findAll({
            attributes: [
                'stage',
                [fn('COUNT', col('requestId')), 'count']
            ],
            group: ['stage']
        });

        const stageStats = {};
        requestsByStage.forEach(item => {
            stageStats[item.stage] = parseInt(item.getDataValue('count'));
        });

        // Requests by team
        const requestsByTeam = await MaintenanceRequest.findAll({
            attributes: [
                'maintenanceTeamId',
                [fn('COUNT', col('requestId')), 'count']
            ],
            include: [
                {
                    model: MaintenanceTeam,
                    as: 'maintenanceTeam',
                    attributes: ['teamName']
                }
            ],
            group: ['maintenanceTeamId']
        });

        const teamStats = requestsByTeam.map(item => ({
            teamId: item.maintenanceTeamId,
            teamName: item.maintenanceTeam.teamName,
            count: parseInt(item.getDataValue('count'))
        }));

        // Requests by category
        const requestsByCategory = await MaintenanceRequest.findAll({
            attributes: [
                'categoryId',
                [fn('COUNT', col('requestId')), 'count']
            ],
            include: [
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryName']
                }
            ],
            group: ['categoryId']
        });

        const categoryStats = requestsByCategory.map(item => ({
            categoryId: item.categoryId,
            categoryName: item.category.categoryName,
            count: parseInt(item.getDataValue('count'))
        }));

        // Requests by priority
        const requestsByPriority = await MaintenanceRequest.findAll({
            attributes: [
                'priority',
                [fn('COUNT', col('requestId')), 'count']
            ],
            group: ['priority']
        });

        const priorityStats = {};
        requestsByPriority.forEach(item => {
            priorityStats[item.priority] = parseInt(item.getDataValue('count'));
        });

        // Requests by type
        const requestsByType = await MaintenanceRequest.findAll({
            attributes: [
                'requestType',
                [fn('COUNT', col('requestId')), 'count']
            ],
            group: ['requestType']
        });

        const typeStats = {};
        requestsByType.forEach(item => {
            typeStats[item.requestType] = parseInt(item.getDataValue('count'));
        });

        // Total equipment
        const totalEquipment = await Equipment.count();

        // Equipment by status
        const equipmentByStatus = await Equipment.findAll({
            attributes: [
                'status',
                [fn('COUNT', col('equipmentId')), 'count']
            ],
            group: ['status']
        });

        const equipmentStatusStats = {};
        equipmentByStatus.forEach(item => {
            equipmentStatusStats[item.status] = parseInt(item.getDataValue('count'));
        });

        // Overdue requests count
        const overdueCount = await MaintenanceRequest.count({
            where: {
                isOverdue: true,
                stage: { [Op.notIn]: ['repaired', 'scrapped'] }
            }
        });

        res.json({
            success: true,
            stats: {
                totalRequests,
                byStage: stageStats,
                byTeam: teamStats,
                byCategory: categoryStats,
                byPriority: priorityStats,
                byType: typeStats,
                totalEquipment,
                equipmentByStatus: equipmentStatusStats,
                overdueCount
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch dashboard statistics'
        });
    }
};

// Get overdue requests
export const getOverdueRequests = async (req, res) => {
    try {
        // First update overdue status for all requests
        const allRequests = await MaintenanceRequest.findAll({
            where: {
                scheduledDate: { [Op.not]: null },
                stage: { [Op.notIn]: ['repaired', 'scrapped'] }
            }
        });

        for (const request of allRequests) {
            const isOverdue = checkOverdue(request.scheduledDate, request.stage);
            if (request.isOverdue !== isOverdue) {
                await request.update({ isOverdue }, { silent: true });
            }
        }

        // Get overdue requests
        const overdueRequests = await MaintenanceRequest.findAll({
            where: {
                isOverdue: true,
                stage: { [Op.notIn]: ['repaired', 'scrapped'] }
            },
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentId', 'equipmentName', 'serialNumber']
                },
                {
                    model: MaintenanceTeam,
                    as: 'maintenanceTeam',
                    attributes: ['teamId', 'teamName']
                },
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['userId', 'fullName', 'email', 'profilePicture']
                },
                {
                    model: User,
                    as: 'createdBy',
                    attributes: ['userId', 'fullName']
                }
            ],
            order: [['scheduledDate', 'ASC']]
        });

        res.json({
            success: true,
            overdueRequests
        });
    } catch (error) {
        console.error('Get overdue requests error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch overdue requests'
        });
    }
};

// Get requests count by team (for reports/charts)
export const getRequestsByTeam = async (req, res) => {
    try {
        const requestsByTeam = await MaintenanceRequest.findAll({
            attributes: [
                'maintenanceTeamId',
                'stage',
                [fn('COUNT', col('requestId')), 'count']
            ],
            include: [
                {
                    model: MaintenanceTeam,
                    as: 'maintenanceTeam',
                    attributes: ['teamName']
                }
            ],
            group: ['maintenanceTeamId', 'stage']
        });

        // Organize data by team
        const teamData = {};
        requestsByTeam.forEach(item => {
            const teamId = item.maintenanceTeamId;
            const teamName = item.maintenanceTeam.teamName;
            const stage = item.stage;
            const count = parseInt(item.getDataValue('count'));

            if (!teamData[teamId]) {
                teamData[teamId] = {
                    teamId,
                    teamName,
                    new: 0,
                    in_progress: 0,
                    repaired: 0,
                    scrapped: 0,
                    total: 0
                };
            }

            teamData[teamId][stage] = count;
            teamData[teamId].total += count;
        });

        const data = Object.values(teamData);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Get requests by team error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch team report'
        });
    }
};

// Get requests count by category (for reports/charts)
export const getRequestsByCategory = async (req, res) => {
    try {
        const requestsByCategory = await MaintenanceRequest.findAll({
            attributes: [
                'categoryId',
                'stage',
                [fn('COUNT', col('requestId')), 'count']
            ],
            include: [
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryName']
                }
            ],
            group: ['categoryId', 'stage']
        });

        // Organize data by category
        const categoryData = {};
        requestsByCategory.forEach(item => {
            const categoryId = item.categoryId;
            const categoryName = item.category.categoryName;
            const stage = item.stage;
            const count = parseInt(item.getDataValue('count'));

            if (!categoryData[categoryId]) {
                categoryData[categoryId] = {
                    categoryId,
                    categoryName,
                    new: 0,
                    in_progress: 0,
                    repaired: 0,
                    scrapped: 0,
                    total: 0
                };
            }

            categoryData[categoryId][stage] = count;
            categoryData[categoryId].total += count;
        });

        const data = Object.values(categoryData);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Get requests by category error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch category report'
        });
    }
};

// Get requests over time (for line charts)
export const getRequestsOverTime = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(days));

        const requests = await MaintenanceRequest.findAll({
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('COUNT', col('requestId')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: daysAgo
                }
            },
            group: [fn('DATE', col('createdAt'))],
            order: [[fn('DATE', col('createdAt')), 'ASC']]
        });

        const data = requests.map(item => ({
            date: item.getDataValue('date'),
            count: parseInt(item.getDataValue('count'))
        }));

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Get requests over time error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch time series data'
        });
    }
};

// Get technician performance
export const getTechnicianPerformance = async (req, res) => {
    try {
        const technicianStats = await MaintenanceRequest.findAll({
            attributes: [
                'assignedToUserId',
                'stage',
                [fn('COUNT', col('requestId')), 'count'],
                [fn('AVG', col('durationHours')), 'avgDuration']
            ],
            where: {
                assignedToUserId: { [Op.not]: null }
            },
            include: [
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['userId', 'fullName', 'email', 'profilePicture']
                }
            ],
            group: ['assignedToUserId', 'stage']
        });

        // Organize data by technician
        const techData = {};
        technicianStats.forEach(item => {
            const userId = item.assignedToUserId;
            const user = item.assignedTo;
            const stage = item.stage;
            const count = parseInt(item.getDataValue('count'));
            const avgDuration = parseFloat(item.getDataValue('avgDuration')) || 0;

            if (!techData[userId]) {
                techData[userId] = {
                    userId,
                    fullName: user.fullName,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    new: 0,
                    in_progress: 0,
                    repaired: 0,
                    scrapped: 0,
                    total: 0,
                    avgDuration: 0
                };
            }

            techData[userId][stage] = count;
            techData[userId].total += count;
            if (stage === 'repaired') {
                techData[userId].avgDuration = avgDuration.toFixed(2);
            }
        });

        const data = Object.values(techData);

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Get technician performance error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch technician performance'
        });
    }
};