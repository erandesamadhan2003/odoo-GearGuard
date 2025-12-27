import { Equipment, EquipmentCategory, Department, MaintenanceRequest } from '../models/index.js';

// Get all equipment
export const getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findAll({
            include: [
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryId', 'categoryName']
                },
                {
                    model: Department,
                    as: 'department',
                    attributes: ['departmentId', 'departmentName'],
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            equipment
        });
    } catch (error) {
        console.error('Get all equipment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch equipment'
        });
    }
};

// Get equipment by ID
export const getEquipmentById = async (req, res) => {
    try {
        const { equipmentId } = req.params;

        const equipment = await Equipment.findByPk(equipmentId, {
            include: [
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryId', 'categoryName']
                },
                {
                    model: Department,
                    as: 'department',
                    attributes: ['departmentId', 'departmentName'],
                    required: false
                }
            ]
        });

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.json({
            success: true,
            equipment
        });
    } catch (error) {
        console.error('Get equipment by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch equipment'
        });
    }
};

// Create equipment
export const createEquipment = async (req, res) => {
    try {
        const {
            equipmentName,
            serialNumber,
            categoryId,
            departmentId,
            maintenanceTeamId,
            assignedToUserId,
            defaultTechnicianId,
            purchaseDate,
            warrantyExpiryDate,
            location,
            status
        } = req.body;

        if (!equipmentName || !serialNumber || !categoryId || !maintenanceTeamId) {
            return res.status(400).json({
                success: false,
                message: 'Equipment name, serial number, category, and maintenance team are required'
            });
        }

        const equipment = await Equipment.create({
            equipmentName,
            serialNumber,
            categoryId,
            departmentId,
            maintenanceTeamId,
            assignedToUserId,
            defaultTechnicianId,
            purchaseDate,
            warrantyExpiryDate,
            location,
            status: status || 'active'
        });

        res.status(201).json({
            success: true,
            message: 'Equipment created successfully',
            equipment
        });
    } catch (error) {
        console.error('Create equipment error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Serial number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create equipment'
        });
    }
};

// Update equipment
export const updateEquipment = async (req, res) => {
    try {
        const { equipmentId } = req.params;
        const updateData = req.body;

        const equipment = await Equipment.findByPk(equipmentId);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        await equipment.update(updateData);

        res.json({
            success: true,
            message: 'Equipment updated successfully',
            equipment
        });
    } catch (error) {
        console.error('Update equipment error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Serial number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update equipment'
        });
    }
};

// Delete equipment
export const deleteEquipment = async (req, res) => {
    try {
        const { equipmentId } = req.params;

        const equipment = await Equipment.findByPk(equipmentId);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        // Check if equipment has maintenance requests
        const requestCount = await MaintenanceRequest.count({
            where: { equipmentId }
        });

        if (requestCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete equipment. It has ${requestCount} maintenance request(s) associated with it.`
            });
        }

        await equipment.destroy();

        res.json({
            success: true,
            message: 'Equipment deleted successfully'
        });
    } catch (error) {
        console.error('Delete equipment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete equipment'
        });
    }
};

// Get equipment requests
export const getEquipmentRequests = async (req, res) => {
    try {
        const { equipmentId } = req.params;

        const requests = await MaintenanceRequest.findAll({
            where: { equipmentId },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            requests
        });
    } catch (error) {
        console.error('Get equipment requests error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch equipment requests'
        });
    }
};

// Get equipment by department
export const getEquipmentByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;

        const equipment = await Equipment.findAll({
            where: { departmentId },
            include: [
                {
                    model: EquipmentCategory,
                    as: 'category',
                    attributes: ['categoryId', 'categoryName']
                }
            ],
            order: [['equipmentName', 'ASC']]
        });

        res.json({
            success: true,
            equipment
        });
    } catch (error) {
        console.error('Get equipment by department error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch equipment'
        });
    }
};
