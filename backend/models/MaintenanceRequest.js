import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const MaintenanceRequest = sequelize.define('MaintenanceRequest', {
    requestId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'request_id'
    },
    subject: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Subject is required'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    equipmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'equipment_id',
        references: {
            model: 'equipment',
            key: 'equipment_id'
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'category_id',
        references: {
            model: 'equipment_categories',
            key: 'category_id'
        }
    },
    maintenanceTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'maintenance_team_id',
        references: {
            model: 'maintenance_teams',
            key: 'team_id'
        }
    },
    requestType: {
        type: DataTypes.ENUM('corrective', 'preventive'),
        allowNull: false,
        field: 'request_type'
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium',
        allowNull: false
    },
    stage: {
        type: DataTypes.ENUM('new', 'in_progress', 'repaired', 'scrapped'),
        defaultValue: 'new',
        allowNull: false
    },
    createdByUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'created_by_user_id',
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    assignedToUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'assigned_to_user_id',
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    scheduledDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'scheduled_date'
    },
    completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'completed_date'
    },
    durationHours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        field: 'duration_hours'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    isOverdue: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_overdue'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'maintenance_requests',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export { MaintenanceRequest };