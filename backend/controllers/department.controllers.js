import { Department } from '../models/index.js';

// Get all departments
export const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll({
            order: [['departmentName', 'ASC']]
        });

        res.json({
            success: true,
            departments
        });
    } catch (error) {
        console.error('Get all departments error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch departments'
        });
    }
};

// Get department by ID
export const getDepartmentById = async (req, res) => {
    try {
        const { departmentId } = req.params;

        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        res.json({
            success: true,
            department
        });
    } catch (error) {
        console.error('Get department by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch department'
        });
    }
};

// Create department (Manager/Admin only)
export const createDepartment = async (req, res) => {
    try {
        const { departmentName, description } = req.body;

        if (!departmentName) {
            return res.status(400).json({
                success: false,
                message: 'Department name is required'
            });
        }

        const department = await Department.create({
            departmentName,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Department created successfully',
            department
        });
    } catch (error) {
        console.error('Create department error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Department name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create department'
        });
    }
};

// Update department (Manager/Admin only)
export const updateDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { departmentName, description } = req.body;

        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        await department.update({
            ...(departmentName && { departmentName }),
            ...(description !== undefined && { description })
        });

        res.json({
            success: true,
            message: 'Department updated successfully',
            department
        });
    } catch (error) {
        console.error('Update department error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Department name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update department'
        });
    }
};

// Delete department (Manager/Admin only)
export const deleteDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;

        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        await department.destroy();

        res.json({
            success: true,
            message: 'Department deleted successfully'
        });
    } catch (error) {
        console.error('Delete department error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete department'
        });
    }
};
