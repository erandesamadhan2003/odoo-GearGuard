import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Equipment = sequelize.define('Equipment', {
    equipmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'equipment_id'
    },
    equipmentName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'equipment_name',
        validate: {
            notEmpty: {
                msg: 'Equipment name is required'
            }
        }
    },
    serialNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'serial_number',
        validate: {
            notEmpty: {
                msg: 'Serial number is required'
            }
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
    departmentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'department_id',
        references: {
            model: 'departments',
            key: 'department_id'
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
    maintenanceTeamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'maintenance_team_id',
        references: {
            model: 'maintenance_teams',
            key: 'team_id'
        }
    },
    defaultTechnicianId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'default_technician_id',
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    purchaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'purchase_date'
    },
    warrantyExpiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'warranty_expiry_date'
    },
    location: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'under_maintenance', 'scrapped'),
        defaultValue: 'active',
        allowNull: false
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
    tableName: 'equipment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export { Equipment };