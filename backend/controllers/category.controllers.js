import { EquipmentCategory, Equipment } from '../models/index.js';

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await EquipmentCategory.findAll({
            order: [['categoryName', 'ASC']],
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentId']
                }
            ]
        });

        const categoriesWithCount = categories.map(cat => {
            const catData = cat.toJSON();
            catData.equipmentCount = catData.equipment.length;
            delete catData.equipment;
            return catData;
        });

        res.json({
            success: true,
            categories: categoriesWithCount
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch categories'
        });
    }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await EquipmentCategory.findByPk(categoryId, {
            include: [
                {
                    model: Equipment,
                    as: 'equipment',
                    attributes: ['equipmentId', 'equipmentName', 'serialNumber', 'status']
                }
            ]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            category
        });
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch category'
        });
    }
};

// Create category
export const createCategory = async (req, res) => {
    try {
        const { categoryName, description } = req.body;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                message: 'Category name is required'
            });
        }

        const category = await EquipmentCategory.create({
            categoryName,
            description
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        console.error('Create category error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create category'
        });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { categoryName, description } = req.body;

        const category = await EquipmentCategory.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        await category.update({
            ...(categoryName && { categoryName }),
            ...(description !== undefined && { description })
        });

        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        console.error('Update category error:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update category'
        });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const category = await EquipmentCategory.findByPk(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if category has equipment
        const equipmentCount = await Equipment.count({
            where: { categoryId }
        });

        if (equipmentCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${equipmentCount} equipment assigned to it.`
            });
        }

        await category.destroy();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete category'
        });
    }
};