import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const RequestHistory = sequelize.define('RequestHistory', {
    historyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'history_id'
    },
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'request_id',
        references: {
            model: 'maintenance_requests',
            key: 'request_id'
        },
        onDelete: 'CASCADE'
    },
    changedByUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'changed_by_user_id',
        references: {
            model: 'users',
            key: 'user_id'
        }
    },
    fieldChanged: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'field_changed'
    },
    oldValue: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'old_value'
    },
    newValue: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'new_value'
    },
    changedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'changed_at'
    }
}, {
    tableName: 'request_history',
    timestamps: false
});

export { RequestHistory };