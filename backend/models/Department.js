import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Department = sequelize.define('Department', {
    departmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'department_id'
    },
    departmentName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'department_name',
        validate: {
            notEmpty: {
                msg: 'Department name is required'
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
    }
}, {
    tableName: 'departments',
    timestamps: false,
    createdAt: 'created_at'
});

export { Department };