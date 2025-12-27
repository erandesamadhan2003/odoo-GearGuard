import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const EquipmentCategory = sequelize.define('EquipmentCategory', {
    categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'category_id'
    },
    categoryName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        field: 'category_name',
        validate: {
            notEmpty: {
                msg: 'Category name is required'
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
    tableName: 'equipment_categories',
    timestamps: false,
    createdAt: 'created_at'
});

export { EquipmentCategory };