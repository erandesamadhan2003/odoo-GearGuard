import { MaintenanceRequest, Equipment, EquipmentCategory, MaintenanceTeam, User } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        const totalRequests = await MaintenanceRequest.count();

        const byStage = await MaintenanceRequest.findAll({
            attributes: [
                'stage',
                [fn('COUNT', col('*')), 'count'] // Use * instead of specific column
            ],
            group: ['stage'],
            raw: true
        });

        const stageMap = {};
        byStage.forEach(item => {
            stageMap[item.stage] = parseInt(item.count);
        });

        const overdueCount = await MaintenanceRequest.count({
            where: {
                scheduledDate: {
                    [Op.lt]: new Date()
                },
                stage: {
                    [Op.notIn]: ['completed', 'cancelled', 'repaired', 'scrapped']
                }
            }
        });

        res.json({
            success: true,
            stats: {
                totalRequests,
                byStage: stageMap,
                overdueCount
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch dashboard stats'
        });
    }
};

// Get overdue requests
export const getOverdueRequests = async (req, res) => {
    try {
        const overdueRequests = await MaintenanceRequest.findAll({
            where: {
                scheduledDate: {
                    [Op.lt]: new Date()
                },
                stage: {
                    [Op.notIn]: ['completed', 'cancelled', 'repaired', 'scrapped']
                }
            },
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentName']
                }
            ],
            order: [['scheduledDate', 'ASC']],
            limit: 10
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

// Get requests by team
export const getRequestsByTeam = async (req, res) => {
    try {
        const data = await MaintenanceRequest.findAll({
            attributes: [
                [fn('COUNT', col('*')), 'count'] // Use * instead of specific column
            ],
            include: [
                {
                    model: MaintenanceTeam,
                    as: 'maintenanceTeam',
                    attributes: ['teamName']
                }
            ],
            group: ['maintenanceTeam.team_id', 'maintenanceTeam.team_name'], // Use actual DB column names
            raw: true
        });

        const formatted = data.map(item => ({
            teamName: item['maintenanceTeam.teamName'] || 'Unassigned',
            count: parseInt(item.count)
        }));

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('Get requests by team error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch requests by team'
        });
    }
};

// Get requests by category
export const getRequestsByCategory = async (req, res) => {
    try {
        const data = await MaintenanceRequest.findAll({
            attributes: [
                [fn('COUNT', col('*')), 'count'] // Use * instead of specific column
            ],
            include: [
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryName']
                }
            ],
            group: ['category.category_id', 'category.category_name'], // Use actual DB column names
            raw: true
        });

        const formatted = data.map(item => ({
            categoryName: item['category.categoryName'] || 'Uncategorized',
            count: parseInt(item.count)
        }));

        res.json({
            success: true,
            data: formatted
        });
    } catch (error) {
        console.error('Get requests by category error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch requests by category'
        });
    }
};

// Get requests over time (last 30 days)
export const getRequestsOverTime = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const data = await MaintenanceRequest.findAll({
            attributes: [
                [fn('DATE', col('created_at')), 'date'], // Use actual DB column name
                [fn('COUNT', col('*')), 'count']
            ],
            where: {
                createdAt: {
                    [Op.gte]: startDate
                }
            },
            group: [fn('DATE', col('created_at'))],
            order: [[fn('DATE', col('created_at')), 'ASC']],
            raw: true
        });

        res.json({
            success: true,
            data
        });
    } catch (error) {
        console.error('Get requests over time error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch requests over time'
        });
    }
};

// Get technician performance
export const getTechnicianPerformance = async (req, res) => {
    try {
        const data = await MaintenanceRequest.findAll({
            attributes: [
                'stage',
                [fn('COUNT', col('*')), 'count']
            ],
            include: [
                {
                    model: User,
                    as: 'assignedTo',
                    attributes: ['fullName'],
                    where: {
                        role: 'technician'
                    }
                }
            ],
            group: ['assignedTo.user_id', 'assignedTo.full_name', 'stage'], // Use actual DB column names
            raw: true
        });

        // Group by technician
        const techMap = {};
        data.forEach(item => {
            const name = item['assignedTo.fullName'] || 'Unassigned';
            if (!techMap[name]) {
                techMap[name] = {
                    technicianName: name,
                    completed: 0,
                    inProgress: 0,
                    total: 0
                };
            }
            const count = parseInt(item.count);
            if (item.stage === 'completed' || item.stage === 'repaired') {
                techMap[name].completed += count;
            } else if (item.stage === 'in_progress') {
                techMap[name].inProgress += count;
            }
            techMap[name].total += count;
        });

        res.json({
            success: true,
            data: Object.values(techMap)
        });
    } catch (error) {
        console.error('Get technician performance error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch technician performance'
        });
    }
};