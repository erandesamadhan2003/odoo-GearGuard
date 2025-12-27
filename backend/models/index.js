import { User } from './User.js';
import { Department } from './Department.js';
import { MaintenanceTeam } from './MaintenanceTeam.js';
import { TeamMember } from './TeamMember.js';
import { EquipmentCategory } from './EquipmentCategory.js';
import { Equipment } from './Equipment.js';
import { MaintenanceRequest } from './MaintenanceRequest.js';
import { RequestHistory } from './RequestHistory.js';

// User Associations
User.hasMany(Equipment, { foreignKey: 'assignedToUserId', as: 'assignedEquipment' });
User.hasMany(Equipment, { foreignKey: 'defaultTechnicianId', as: 'defaultTechnicianEquipment' });
User.hasMany(MaintenanceRequest, { foreignKey: 'createdByUserId', as: 'createdRequests' });
User.hasMany(MaintenanceRequest, { foreignKey: 'assignedToUserId', as: 'assignedRequests' });
User.hasMany(RequestHistory, { foreignKey: 'changedByUserId', as: 'historyChanges' });
User.belongsToMany(MaintenanceTeam, { through: TeamMember, foreignKey: 'userId', as: 'teams' });

// Department Associations
Department.hasMany(Equipment, { foreignKey: 'departmentId', as: 'equipment' });

// MaintenanceTeam Associations
MaintenanceTeam.hasMany(Equipment, { foreignKey: 'maintenanceTeamId', as: 'equipment' });
MaintenanceTeam.hasMany(MaintenanceRequest, { foreignKey: 'maintenanceTeamId', as: 'requests' });
MaintenanceTeam.belongsToMany(User, { through: TeamMember, foreignKey: 'teamId', as: 'members' });

// TeamMember Associations
TeamMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
TeamMember.belongsTo(MaintenanceTeam, { foreignKey: 'teamId', as: 'team' });

// EquipmentCategory Associations
EquipmentCategory.hasMany(Equipment, { foreignKey: 'categoryId', as: 'equipment' });
EquipmentCategory.hasMany(MaintenanceRequest, { foreignKey: 'categoryId', as: 'requests' });

// Equipment Associations
Equipment.belongsTo(EquipmentCategory, { foreignKey: 'categoryId', as: 'category' });
Equipment.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Equipment.belongsTo(User, { foreignKey: 'assignedToUserId', as: 'assignedUser' });
Equipment.belongsTo(MaintenanceTeam, { foreignKey: 'maintenanceTeamId', as: 'maintenanceTeam' });
Equipment.belongsTo(User, { foreignKey: 'defaultTechnicianId', as: 'defaultTechnician' });
Equipment.hasMany(MaintenanceRequest, { foreignKey: 'equipmentId', as: 'requests' });

// MaintenanceRequest Associations
MaintenanceRequest.belongsTo(Equipment, { foreignKey: 'equipmentId', as: 'equipment' });
MaintenanceRequest.belongsTo(EquipmentCategory, { foreignKey: 'categoryId', as: 'category' });
MaintenanceRequest.belongsTo(MaintenanceTeam, { foreignKey: 'maintenanceTeamId', as: 'maintenanceTeam' });
MaintenanceRequest.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdBy' });
MaintenanceRequest.belongsTo(User, { foreignKey: 'assignedToUserId', as: 'assignedTo' });
MaintenanceRequest.hasMany(RequestHistory, { foreignKey: 'requestId', as: 'history' });

// RequestHistory Associations
RequestHistory.belongsTo(MaintenanceRequest, { foreignKey: 'requestId', as: 'request' });
RequestHistory.belongsTo(User, { foreignKey: 'changedByUserId', as: 'changedBy' });

export {
    User,
    Department,
    MaintenanceTeam,
    TeamMember,
    EquipmentCategory,
    Equipment,
    MaintenanceRequest,
    RequestHistory
};