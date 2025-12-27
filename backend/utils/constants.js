// Constants for the application

export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    TECHNICIAN: 'technician',
    USER: 'user'
};

export const EQUIPMENT_STATUS = {
    ACTIVE: 'active',
    UNDER_MAINTENANCE: 'under_maintenance',
    SCRAPPED: 'scrapped'
};

export const REQUEST_TYPES = {
    CORRECTIVE: 'corrective',
    PREVENTIVE: 'preventive'
};

export const REQUEST_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

export const REQUEST_STAGES = {
    NEW: 'new',
    IN_PROGRESS: 'in_progress',
    REPAIRED: 'repaired',
    SCRAPPED: 'scrapped'
};

export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MAX_LIMIT: 100
};

export const AUTH_PROVIDERS = {
    LOCAL: 'local',
    GOOGLE: 'google'
};