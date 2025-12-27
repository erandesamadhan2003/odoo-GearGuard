// Role-based access control utilities

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  TECHNICIAN: 'technician',
  USER: 'user', // Also called "Operator"
};

// Check if user has admin privileges
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

// Check if user has manager privileges
export const isManager = (user) => {
  return user?.role === ROLES.MANAGER;
};

// Check if user has admin or manager privileges
export const isAdminOrManager = (user) => {
  return isAdmin(user) || isManager(user);
};

// Check if user is technician
export const isTechnician = (user) => {
  return user?.role === ROLES.TECHNICIAN;
};

// Check if user is operator (regular user)
export const isOperator = (user) => {
  return user?.role === ROLES.USER;
};

// Check if user can manage equipment (Admin, Manager)
export const canManageEquipment = (user) => {
  return isAdminOrManager(user);
};

// Check if user can manage teams (Admin, Manager)
export const canManageTeams = (user) => {
  return isAdminOrManager(user);
};

// Check if user can manage categories (Admin only)
export const canManageCategories = (user) => {
  return isAdmin(user);
};

// Check if user can manage departments (Admin only)
export const canManageDepartments = (user) => {
  return isAdmin(user);
};

// Check if user can assign requests (Admin, Manager)
export const canAssignRequests = (user) => {
  return isAdminOrManager(user);
};

// Check if user can view analytics (Admin, Manager only - per matrix)
export const canViewAnalytics = (user) => {
  return isAdmin(user) || isManager(user);
};

// Check if user can view dashboard (Admin, Manager only - per matrix)
export const canViewDashboard = (user) => {
  return isAdmin(user) || isManager(user);
};

// Get display name for role (map "user" to "Operator" in UI)
export const getRoleDisplayName = (role) => {
  const roleMap = {
    'admin': 'Admin',
    'manager': 'Manager',
    'technician': 'Technician',
    'user': 'Operator'
  };
  return roleMap[role] || role;
};

// Check if user can edit requests (Admin, Manager, Technician for assigned)
export const canEditRequest = (user, request) => {
  if (isAdminOrManager(user)) return true;
  if (isTechnician(user) && request?.assignedToUserId === user?.userId) return true;
  return false;
};

// Check if user can update request stage (Admin, Manager, Technician for assigned)
export const canUpdateRequestStage = (user, request) => {
  if (isAdminOrManager(user)) return true;
  if (isTechnician(user) && request?.assignedToUserId === user?.userId) return true;
  return false;
};

