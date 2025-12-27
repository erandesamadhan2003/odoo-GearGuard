import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const TeamMember = sequelize.define('TeamMember', {
    teamMemberId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'team_member_id'
    },
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'team_id',
        references: {
            model: 'maintenance_teams',
            key: 'team_id'
        },
        onDelete: 'CASCADE'
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'user_id'
        },
        onDelete: 'CASCADE'
    },
    isLead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_lead'
    },
    joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'joined_at'
    }
}, {
    tableName: 'team_members',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['team_id', 'user_id'],
            name: 'unique_team_user'
        }
    ]
});

export { TeamMember };