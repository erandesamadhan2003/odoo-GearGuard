import { Op } from 'sequelize';

// Check if request is overdue
export const checkOverdue = (scheduledDate, stage) => {
    if (!scheduledDate) return false;
    if (stage === 'repaired' || stage === 'scrapped') return false;
    
    const now = new Date();
    const scheduled = new Date(scheduledDate);
    
    return now > scheduled;
};

// Format pagination response
export const formatPaginationResponse = (data, page, limit, total) => {
    return {
        data,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(total),
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1
        }
    };
};

// Build filter query for equipment
export const buildEquipmentFilters = (filters) => {
    const where = {};
    
    if (filters.status) {
        where.status = filters.status;
    }
    
    if (filters.departmentId) {
        where.departmentId = filters.departmentId;
    }
    
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    
    if (filters.maintenanceTeamId) {
        where.maintenanceTeamId = filters.maintenanceTeamId;
    }
    
    if (filters.search) {
        where[Op.or] = [
            { equipmentName: { [Op.like]: `%${filters.search}%` } },
            { serialNumber: { [Op.like]: `%${filters.search}%` } },
            { location: { [Op.like]: `%${filters.search}%` } }
        ];
    }
    
    return where;
};

// Build filter query for maintenance requests
export const buildRequestFilters = (filters) => {
    const where = {};
    
    if (filters.stage) {
        where.stage = filters.stage;
    }
    
    if (filters.priority) {
        where.priority = filters.priority;
    }
    
    if (filters.requestType) {
        where.requestType = filters.requestType;
    }
    
    if (filters.maintenanceTeamId) {
        where.maintenanceTeamId = filters.maintenanceTeamId;
    }
    
    if (filters.equipmentId) {
        where.equipmentId = filters.equipmentId;
    }
    
    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }
    
    if (filters.assignedToUserId) {
        where.assignedToUserId = filters.assignedToUserId;
    }
    
    if (filters.createdByUserId) {
        where.createdByUserId = filters.createdByUserId;
    }
    
    if (filters.isOverdue !== undefined) {
        where.isOverdue = filters.isOverdue === 'true' || filters.isOverdue === true;
    }
    
    if (filters.search) {
        where[Op.or] = [
            { subject: { [Op.like]: `%${filters.search}%` } },
            { description: { [Op.like]: `%${filters.search}%` } }
        ];
    }
    
    return where;
};

// Calculate duration in hours between two dates
export const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    return (diffMs / (1000 * 60 * 60)).toFixed(2); // Convert to hours
};

// Sanitize user data for response
export const sanitizeUser = (user) => {
    const { password, googleId, ...sanitized } = user.toJSON ? user.toJSON() : user;
    return sanitized;
};