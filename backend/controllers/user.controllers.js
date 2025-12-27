import { User, TeamMember, MaintenanceTeam } from '../models/index.js';
import { sanitizeUser } from '../utils/helpers.js';

// Get all users (Admin/Manager only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch users'
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: MaintenanceTeam,
                    as: 'teams',
                    through: { attributes: ['isLead', 'joinedAt'] }
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user'
        });
    }
};

// Update user
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, email, role, profilePicture } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Only admin can change roles
        if (role && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can change user roles'
            });
        }

        // Users can only update their own profile (unless admin)
        if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own profile'
            });
        }

        await user.update({
            ...(fullName && { fullName }),
            ...(email && { email }),
            ...(role && { role }),
            ...(profilePicture !== undefined && { profilePicture })
        });

        res.json({
            success: true,
            message: 'User updated successfully',
            user: sanitizeUser(user)
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user'
        });
    }
};

// Delete user (Admin only)
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting yourself
        if (req.user.id === parseInt(userId)) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await user.destroy();

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete user'
        });
    }
};

// Get all technicians
export const getAllTechnicians = async (req, res) => {
    try {
        const technicians = await User.findAll({
            where: {
                role: ['technician', 'manager', 'admin']
            },
            attributes: { exclude: ['password'] },
            order: [['fullName', 'ASC']]
        });

        res.json({
            success: true,
            technicians
        });
    } catch (error) {
        console.error('Get technicians error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch technicians'
        });
    }
};

// Create user
export const createUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Only admin can create users
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only administrators can create users'
            });
        }

        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            role: role || 'user',
            authProvider: 'local'
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create user'
        });
    }
};