import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const MaintenanceTeam = sequelize.define('MaintenanceTeam', {
    teamId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'team_id'
    },
    teamName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'team_name',
        validate: {
            notEmpty: {
                msg: 'Team name is required'
            }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
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
    tableName: 'maintenance_teams',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export { MaintenanceTeam };