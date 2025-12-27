# GearGuard Backend API Documentation

## 📦 Package.json

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "license": "ISC",
  "author": "",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "express-session": "^1.18.2",
    "jsonwebtoken": "^9.0.3",
    "mysql2": "^3.11.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "sequelize": "^6.37.0"
  }
}
```

### Key Dependencies:
- **express** - Web framework
- **sequelize** - SQL ORM (MySQL)
- **mysql2** - MySQL driver
- **passport** - Authentication middleware
- **passport-google-oauth20** - Google OAuth strategy
- **jsonwebtoken** - JWT token generation
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **express-session** - Session management

---

## 📁 Complete File Structure

### **Root Directory Files**

#### `server.js` - Main Entry Point ⭐
**Purpose**: Application entry point and HTTP server

**What it does:**
1. Loads environment variables from `.env`
2. Initializes database connection
3. Creates Express application
4. Configures middleware (CORS, body parser, sessions)
5. Sets up Passport for authentication
6. Registers all API routes
7. Starts HTTP server on configured port

**Request Flow:**
```
Request → CORS → Body Parser → Session → Passport → Routes → Controllers → Response
```

**Key Routes:**
- `/api/auth/*` - Authentication endpoints
- `/api/users/*` - User management
- `/api/departments/*` - Department management
- `/api/teams/*` - Maintenance team management
- `/api/categories/*` - Equipment category management
- `/api/equipment/*` - Equipment management
- `/api/requests/*` - Maintenance request management
- `/api/dashboard/*` - Analytics and reports

---

#### `package.json` - Project Configuration
**Purpose**: Defines project metadata, dependencies, and scripts

**Scripts:**
- `start` - Runs production server
- `dev` - Runs development server with auto-reload (nodemon)

---

#### `.env` - Environment Variables
**Purpose**: Stores sensitive configuration (NOT committed to Git)

**Required Variables:**
```env
# Server
PORT=3000
NODE_ENV=development

# Database (MySQL)
DB_HOST=your_host
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:5173

# Session
SESSION_SECRET=your_session_secret
```

---

### **📂 config/** - Configuration Files

#### `config/db.js` - Database Connection ⭐
**Purpose**: Connects to MySQL database using Sequelize

**What it does:**
1. Creates Sequelize instance with MySQL connection details
2. Tests database connection on startup
3. Synchronizes models with database (creates/updates tables)
4. Exports sequelize instance for models to use

**Key Features:**
- Connection pooling (max 5 connections)
- Automatic table creation/updates
- SQL query logging disabled (can be enabled for debugging)

**Flow:**
```
App Start → Connect to MySQL → Authenticate → Sync Models → Ready
```

---

#### `config/passport.js` - Authentication Strategy
**Purpose**: Configures Passport.js for Google OAuth authentication

**What it does:**
1. Sets up Google OAuth 2.0 strategy
2. Handles Google authentication callback
3. Creates new users or links Google account to existing users
4. Serializes/deserializes user for sessions

**Google OAuth Flow:**
1. User clicks "Sign in with Google"
2. Redirected to Google login
3. Google redirects back with profile info
4. Passport strategy:
   - Checks if user exists with `googleId`
   - If not, checks if email exists (links accounts)
   - If neither, creates new user
5. User logged in and redirected to frontend

---

### **📂 models/** - Database Models (Tables)

Models define the database schema using Sequelize. Each model represents a table.

#### `models/User.js` - User Table
**Purpose**: Stores user accounts and authentication info

**Fields:**
- `userId` (PK) - Primary key
- `fullName` - User's display name
- `email` (UNIQUE) - Login email (lowercased automatically)
- `password` - Hashed password (nullable for Google OAuth users)
- `googleId` (UNIQUE) - Google account ID (nullable)
- `authProvider` - 'local' or 'google' (default: 'local')
- `profilePicture` - Avatar URL
- `role` - 'admin', 'manager', 'technician', or 'user' (default: 'user')
- `createdAt`, `updatedAt` - Timestamps

**Special Features:**
- **Hooks**: Auto-hashes password before save (local auth only)
- **Hooks**: Auto-lowercases email
- **Method**: `comparePassword()` - Validates password
- **Method**: `toJSON()` - Excludes password from JSON output

---

#### `models/Department.js` - Department Table
**Purpose**: Stores company departments/organizational units

**Fields:**
- `departmentId` (PK) - Primary key
- `departmentName` (UNIQUE) - Department name (e.g., "Production", "IT")
- `description` - Department details
- `createdAt` - Timestamp

**Relationships:**
- Has many Equipment

---

#### `models/MaintenanceTeam.js` - Maintenance Team Table
**Purpose**: Stores maintenance teams (groups of technicians)

**Fields:**
- `teamId` (PK) - Primary key
- `teamName` (UNIQUE) - Team name (e.g., "Mechanics", "IT Support")
- `description` - Team details
- `createdAt`, `updatedAt` - Timestamps

**Relationships:**
- Has many Equipment
- Has many MaintenanceRequests
- Has many Users (through TeamMember - many-to-many)

---

#### `models/TeamMember.js` - Team Member Table (Junction)
**Purpose**: Links users to teams (many-to-many relationship)

**Fields:**
- `teamMemberId` (PK) - Primary key
- `teamId` (FK) - References maintenance_teams
- `userId` (FK) - References users
- `isLead` - Boolean (is team leader?)
- `joinedAt` - When user joined team
- UNIQUE(teamId, userId) - Can't join same team twice

**Relationships:**
- Belongs to User
- Belongs to MaintenanceTeam

---

#### `models/EquipmentCategory.js` - Equipment Category Table
**Purpose**: Stores equipment classifications/types

**Fields:**
- `categoryId` (PK) - Primary key
- `categoryName` (UNIQUE) - Category name (e.g., "CNC Machines", "Computers")
- `description` - Category details
- `createdAt` - Timestamp

**Relationships:**
- Has many Equipment
- Has many MaintenanceRequests

---

#### `models/Equipment.js` - Equipment Table ⭐
**Purpose**: Stores company assets/machines that need maintenance

**Fields:**
- `equipmentId` (PK) - Primary key
- `equipmentName` - Equipment name (e.g., "CNC Machine 01")
- `serialNumber` (UNIQUE) - Equipment serial number
- `categoryId` (FK, REQUIRED) - What type? → equipment_categories
- `departmentId` (FK, OPTIONAL) - Where? → departments
- `assignedToUserId` (FK, OPTIONAL) - Who uses it? → users
- `maintenanceTeamId` (FK, REQUIRED) - Who maintains? → maintenance_teams
- `defaultTechnicianId` (FK, OPTIONAL) - Default fixer → users
- `purchaseDate` - When equipment was purchased
- `warrantyExpiryDate` - Warranty expiration
- `location` - Physical location
- `status` - 'active', 'under_maintenance', or 'scrapped' (default: 'active')
- `createdAt`, `updatedAt` - Timestamps

**Relationships:**
- Belongs to EquipmentCategory
- Belongs to Department (optional)
- Belongs to User (assignedToUser - optional)
- Belongs to MaintenanceTeam
- Belongs to User (defaultTechnician - optional)
- Has many MaintenanceRequests

**Key Point**: This table connects everything together! Requests reference equipment, which has team and category.

---

#### `models/MaintenanceRequest.js` - Maintenance Request Table ⭐
**Purpose**: Stores maintenance work orders/requests

**Fields:**
- `requestId` (PK) - Primary key
- `subject` - Short description (required)
- `description` - Full details
- `equipmentId` (FK, REQUIRED) - Which machine? → equipment
- `categoryId` (FK, REQUIRED) - Auto-filled from equipment
- `maintenanceTeamId` (FK, REQUIRED) - Auto-filled from equipment
- `requestType` - 'corrective' (breakdown) or 'preventive' (scheduled)
- `priority` - 'low', 'medium', 'high', or 'urgent' (default: 'medium')
- `stage` - 'new', 'in_progress', 'repaired', or 'scrapped' (default: 'new')
- `createdByUserId` (FK, REQUIRED) - Who reported? → users
- `assignedToUserId` (FK, OPTIONAL) - Who fixes? → users
- `scheduledDate` - When maintenance should be done
- `completedDate` - When work was finished
- `durationHours` - How long work took (decimal)
- `notes` - Additional information
- `isOverdue` - Boolean (calculated)
- `createdAt`, `updatedAt` - Timestamps

**Request Lifecycle:**
```
NEW → (assign technician) → IN_PROGRESS → (complete) → REPAIRED
                                         → (can't fix) → SCRAPPED
```

**Relationships:**
- Belongs to Equipment
- Belongs to EquipmentCategory
- Belongs to MaintenanceTeam
- Belongs to User (createdBy)
- Belongs to User (assignedTo - optional)
- Has many RequestHistory

---

#### `models/RequestHistory.js` - Request History Table
**Purpose**: Audit trail for request changes

**Fields:**
- `historyId` (PK) - Primary key
- `requestId` (FK) - Which request? → maintenance_requests
- `changedByUserId` (FK) - Who made the change? → users
- `fieldChanged` - Which field changed (e.g., "stage", "assignedToUserId")
- `oldValue` - Previous value
- `newValue` - New value
- `changedAt` - When change occurred

**Relationships:**
- Belongs to MaintenanceRequest
- Belongs to User (changedBy)

**Cascading**: Deleted when request is deleted

---

#### `models/index.js` - Model Associations ⭐
**Purpose**: Defines relationships between all models

**What it does:**
1. Imports all models
2. Sets up foreign key relationships
3. Defines associations (hasMany, belongsTo, belongsToMany)
4. Exports all models together

**Key Relationships:**
- User ↔ Team (many-to-many via TeamMember)
- Equipment → Requests (one-to-many)
- Equipment → Category (many-to-one)
- Equipment → Department (many-to-one, optional)
- Equipment → MaintenanceTeam (many-to-one)
- Request → Equipment (many-to-one)
- Request → User (many-to-one for creator and assignee)

**Why it's important**: Without this file, Sequelize can't perform JOIN queries or eager loading.

---

### **📂 middleware/** - Request Interceptors

Middleware functions run before controllers and can modify requests/responses.

#### `middleware/auth.middleware.js` - Authentication Guard
**Purpose**: Verifies user is logged in via JWT token

**What it does:**
1. Extracts JWT token from `Authorization: Bearer <token>` header
2. Verifies token is valid and not expired
3. Decodes token to get user ID
4. Retrieves user from database
5. Attaches user object to `req.user`
6. Calls `next()` if successful, returns 401 if failed

**Usage:**
```javascript
router.get('/protected', authMiddleware, controller);
```

**User Object Structure:**
```javascript
req.user = {
  userId: 1,
  id: 1,  // Alias for compatibility
  fullName: "John Doe",
  email: "john@example.com",
  role: "manager",
  // ... (password excluded)
}
```

---

#### `middleware/roleAuth.middleware.js` - Authorization Guard
**Purpose**: Checks if user has required role/permission

**Functions:**
- `requireRole(...roles)` - Generic role checker (returns middleware)
- `requireAdmin` - Admin only
- `requireManager` - Admin or Manager
- `requireTechnician` - Admin, Manager, or Technician

**Usage:**
```javascript
// Must use AFTER authMiddleware
router.post('/admin-only', authMiddleware, requireAdmin, controller);
router.put('/manager-only', authMiddleware, requireManager, controller);
```

**Flow:**
```
authMiddleware → roleAuth → Controller
```

---

#### `middleware/validation.middleware.js` - Input Validation
**Purpose**: Validates request parameters before reaching controllers

**Functions:**
- `validateId(paramName)` - Validates URL params are positive integers

**What it does:**
1. Checks if parameter exists
2. Validates it's a valid integer
3. Validates it's positive (> 0)
4. Parses to integer and updates req.params
5. Returns 400 error if validation fails

**Usage:**
```javascript
router.get('/:userId', validateId('userId'), getUserById);
```

---

#### `middleware/errorHandler.middleware.js` - Error Handler
**Purpose**: Catches and formats all errors consistently

**What it handles:**
- Sequelize validation errors → 400 with field messages
- Unique constraint violations → 400 with field name
- Foreign key constraint errors → 400 with message
- JWT errors (invalid/expired) → 401
- Generic errors → 500 with message

**Usage:**
```javascript
// Must be LAST middleware in server.js
app.use(errorHandler);
```

---

### **📂 controllers/** - Business Logic

Controllers handle the actual work: they receive requests, interact with the database, apply business logic, and return responses.

#### `controllers/auth.controllers.js` - Authentication Logic
**Functions:**

1. **`register(req, res)`**
   - Creates new user account
   - Validates required fields (fullName, email, password)
   - Checks if email already exists
   - Hashes password automatically (via model hook)
   - Returns JWT token and user info

2. **`login(req, res)`**
   - Validates email/password
   - Checks if user exists
   - Verifies password using `comparePassword()`
   - Prevents Google OAuth users from using password login
   - Returns JWT token and user info

3. **`googleCallBack(req, res)`**
   - Called after Google OAuth authentication
   - User already authenticated by Passport
   - Generates JWT token
   - Redirects to frontend with token in URL

4. **`logout(req, res)`**
   - Logs out user (mainly for session-based auth)
   - Returns success message

5. **`getProfile(req, res)`**
   - Returns current user's profile
   - Requires authentication (via authMiddleware)
   - Excludes password from response

---

#### `controllers/user.controllers.js` - User Management
**Functions:**

1. **`getAllUsers(req, res)`**
   - Lists all users (Manager/Admin only)
   - Excludes passwords
   - Orders by creation date (newest first)

2. **`getUserById(req, res)`**
   - Gets single user by ID
   - Includes team memberships
   - Excludes password

3. **`updateUser(req, res)`**
   - Updates user information
   - Only admin can change roles
   - Users can only update their own profile (unless admin)
   - Validates ownership before update

4. **`deleteUser(req, res)`**
   - Deletes user (Admin only)
   - Prevents self-deletion
   - Returns success message

5. **`getAllTechnicians(req, res)`**
   - Lists users with role: technician, manager, or admin
   - Used for assigning maintenance requests
   - Sorted alphabetically by name

---

#### `controllers/department.controllers.js` - Department Management
**Functions:**

1. **`getAllDepartments(req, res)`**
   - Lists all departments
   - Sorted alphabetically

2. **`getDepartmentById(req, res)`**
   - Gets single department details

3. **`createDepartment(req, res)`**
   - Creates new department (Manager/Admin only)
   - Validates department name is unique

4. **`updateDepartment(req, res)`**
   - Updates department info (Manager/Admin only)
   - Validates uniqueness on name change

5. **`deleteDepartment(req, res)`**
   - Deletes department (Manager/Admin only)
   - Returns error if department has equipment (should check in future)

---

#### `controllers/team.controllers.js` - Team Management
**Functions:**

1. **`getAllTeams(req, res)`**
   - Lists all teams with member information
   - Includes user details for each member

2. **`getTeamById(req, res)`**
   - Gets team with all members and their roles

3. **`createTeam(req, res)`**
   - Creates new team (Manager/Admin only)
   - Validates team name is unique

4. **`updateTeam(req, res)`**
   - Updates team info (Manager/Admin only)

5. **`deleteTeam(req, res)`**
   - Deletes team (Manager/Admin only)

6. **`addTeamMember(req, res)`**
   - Adds user to team (Manager/Admin only)
   - Prevents duplicate memberships
   - Sets `isLead` flag if provided

7. **`removeTeamMember(req, res)`**
   - Removes user from team (Manager/Admin only)

---

#### `controllers/category.controllers.js` - Category Management
**Functions:**

1. **`getAllCategories(req, res)`**
   - Lists all categories
   - Includes equipment count per category

2. **`getCategoryById(req, res)`**
   - Gets category with equipment list

3. **`createCategory(req, res)`**
   - Creates new category (Manager/Admin only)

4. **`updateCategory(req, res)`**
   - Updates category (Manager/Admin only)

5. **`deleteCategory(req, res)`**
   - Deletes category (Manager/Admin only)
   - **Prevents deletion** if category has equipment assigned

---

#### `controllers/equipment.controllers.js` - Equipment Management
**Functions:**

1. **`getAllEquipment(req, res)`**
   - Lists all equipment
   - Includes category and department info
   - Sorted by creation date (newest first)

2. **`getEquipmentById(req, res)`**
   - Gets equipment details
   - Includes category and department

3. **`createEquipment(req, res)`**
   - Creates new equipment (Manager/Admin only)
   - Requires: name, serial number, category, maintenance team
   - Validates serial number is unique

4. **`updateEquipment(req, res)`**
   - Updates equipment info (Manager/Admin only)
   - Can update any field

5. **`deleteEquipment(req, res)`**
   - Deletes equipment (Manager/Admin only)
   - **Prevents deletion** if equipment has maintenance requests

6. **`getEquipmentRequests(req, res)`**
   - Lists all requests for specific equipment
   - Sorted by creation date

7. **`getEquipmentByDepartment(req, res)`**
   - Filters equipment by department
   - Includes category info

---

#### `controllers/request.controllers.js` - Request Management ⭐
**Functions:**

1. **`getAllRequests(req, res)`**
   - Lists all requests with filters
   - Supports filtering by: stage, priority, type, equipment, team, assignee
   - Includes related data (equipment, category, team, users)
   - Sorted by creation date (newest first)

2. **`getRequestById(req, res)`**
   - Gets full request details
   - Includes equipment, category, team, creator, assignee
   - Includes complete history log

3. **`createRequest(req, res)`**
   - Creates new maintenance request
   - **Auto-fills** categoryId and maintenanceTeamId from equipment
   - Sets createdByUserId to current user
   - Sets stage to 'new'

4. **`updateRequest(req, res)`**
   - Updates request information
   - Only creator or manager/admin can update
   - Validates ownership

5. **`updateRequestStage(req, res)`** ⭐
   - Moves request between stages
   - Validates stage transition
   - When moving to 'repaired' or 'scrapped':
     - Sets completedDate
     - Auto-assigns if not assigned
   - Creates history entry

6. **`assignRequest(req, res)`**
   - Assigns request to technician (Manager/Admin only)
   - Automatically changes stage to 'in_progress' if 'new'
   - Creates history entry

7. **`deleteRequest(req, res)`**
   - Deletes request (Manager/Admin only)

8. **`getCalendarRequests(req, res)`**
   - Returns requests for calendar view
   - Supports date range filtering
   - Returns minimal data for calendar display

9. **`getMyRequests(req, res)`**
   - Returns requests created by current user
   - Includes equipment and assignee info

10. **`getAssignedToMeRequests(req, res)`**
    - Returns requests assigned to current user
    - Includes equipment and creator info

---

#### `controllers/dashboard.controllers.js` - Analytics & Reports
**Functions:**

1. **`getDashboardStats(req, res)`**
   - Returns overview statistics:
     - Total requests count
     - Requests by stage (new, in_progress, repaired, scrapped)
     - Requests by team
     - Requests by category
     - Requests by priority
     - Requests by type
     - Total equipment count
     - Equipment by status
     - Overdue requests count

2. **`getOverdueRequests(req, res)`**
   - Updates overdue status for all requests
   - Returns list of overdue requests
   - Includes equipment, team, and assignee info

3. **`getRequestsByTeam(req, res)`**
   - Returns request counts per team
   - Grouped by stage
   - Used for bar/pie charts

4. **`getRequestsByCategory(req, res)`**
   - Returns request counts per category
   - Grouped by stage
   - Used for charts

5. **`getRequestsOverTime(req, res)`**
   - Returns time series data
   - Shows request creation over time
   - Supports days parameter (default: 30)
   - Used for line charts

6. **`getTechnicianPerformance(req, res)`**
   - Returns performance metrics per technician
   - Shows requests by stage
   - Includes average duration for completed work
   - Used for performance dashboards

---

### **📂 routes/** - URL to Controller Mapping

Routes connect HTTP requests to controller functions and apply middleware.

#### `routes/auth.routes.js` - Authentication Routes
```
POST   /api/auth/register         → register (public)
POST   /api/auth/login            → login (public)
GET    /api/auth/google           → Google OAuth (public)
GET    /api/auth/google/callback  → googleCallBack (handled by Passport)
GET    /api/auth/profile          → getProfile (requires auth)
GET    /api/auth/me               → getProfile (alias, requires auth)
POST   /api/auth/logout           → logout (requires auth)
```

---

#### `routes/user.routes.js` - User Routes
```
GET    /api/users/technicians     → getAllTechnicians (requires auth)
GET    /api/users                 → getAllUsers (requires auth + manager)
GET    /api/users/:userId         → getUserById (requires auth)
PUT    /api/users/:userId         → updateUser (requires auth)
DELETE /api/users/:userId         → deleteUser (requires auth + admin)
```

---

#### `routes/department.routes.js` - Department Routes
```
GET    /api/departments           → getAllDepartments (requires auth)
GET    /api/departments/:departmentId → getDepartmentById (requires auth)
POST   /api/departments           → createDepartment (requires auth + manager)
PUT    /api/departments/:departmentId → updateDepartment (requires auth + manager)
DELETE /api/departments/:departmentId → deleteDepartment (requires auth + manager)
```

---

#### `routes/team.routes.js` - Team Routes
```
GET    /api/teams                 → getAllTeams (requires auth)
GET    /api/teams/:teamId         → getTeamById (requires auth)
POST   /api/teams                 → createTeam (requires auth + manager)
PUT    /api/teams/:teamId         → updateTeam (requires auth + manager)
DELETE /api/teams/:teamId         → deleteTeam (requires auth + manager)
POST   /api/teams/:teamId/members → addTeamMember (requires auth + manager)
DELETE /api/teams/:teamId/members/:userId → removeTeamMember (requires auth + manager)
```

---

#### `routes/category.routes.js` - Category Routes
```
GET    /api/categories            → getAllCategories (requires auth)
GET    /api/categories/:categoryId → getCategoryById (requires auth)
POST   /api/categories            → createCategory (requires auth + manager)
PUT    /api/categories/:categoryId → updateCategory (requires auth + manager)
DELETE /api/categories/:categoryId → deleteCategory (requires auth + manager)
```

---

#### `routes/equipment.routes.js` - Equipment Routes
```
GET    /api/equipment                          → getAllEquipment (requires auth)
GET    /api/equipment/by-department/:departmentId → getEquipmentByDepartment (requires auth)
GET    /api/equipment/:equipmentId             → getEquipmentById (requires auth)
GET    /api/equipment/:equipmentId/requests    → getEquipmentRequests (requires auth)
POST   /api/equipment                          → createEquipment (requires auth + manager)
PUT    /api/equipment/:equipmentId             → updateEquipment (requires auth + manager)
DELETE /api/equipment/:equipmentId             → deleteEquipment (requires auth + manager)
```

---

#### `routes/request.routes.js` - Request Routes
```
GET    /api/requests/calendar           → getCalendarRequests (requires auth)
GET    /api/requests/my-requests        → getMyRequests (requires auth)
GET    /api/requests/assigned-to-me     → getAssignedToMeRequests (requires auth)
GET    /api/requests                    → getAllRequests (requires auth)
GET    /api/requests/:requestId         → getRequestById (requires auth)
POST   /api/requests                    → createRequest (requires auth)
PUT    /api/requests/:requestId         → updateRequest (requires auth)
PATCH  /api/requests/:requestId/stage   → updateRequestStage (requires auth + technician)
PATCH  /api/requests/:requestId/assign  → assignRequest (requires auth + manager)
DELETE /api/requests/:requestId         → deleteRequest (requires auth + manager)
```

---

#### `routes/dashboard.routes.js` - Dashboard Routes
```
GET    /api/dashboard/stats                        → getDashboardStats (requires auth)
GET    /api/dashboard/overdue                      → getOverdueRequests (requires auth)
GET    /api/dashboard/requests-over-time           → getRequestsOverTime (requires auth)
GET    /api/dashboard/technician-performance       → getTechnicianPerformance (requires auth)
GET    /api/dashboard/reports/requests-by-team     → getRequestsByTeam (requires auth)
GET    /api/dashboard/reports/requests-by-category → getRequestsByCategory (requires auth)
```

---

### **📂 utils/** - Helper Functions

#### `utils/helpers.js` - Utility Functions
**Functions:**

1. **`checkOverdue(scheduledDate, stage)`**
   - Determines if request is overdue
   - Returns false if no scheduled date or already completed
   - Compares scheduled date to current date

2. **`formatPaginationResponse(data, page, limit, total)`**
   - Formats paginated API responses
   - Includes pagination metadata

3. **`buildEquipmentFilters(filters)`**
   - Builds Sequelize WHERE clause for equipment search
   - Supports filtering by status, department, category, team, search text

4. **`buildRequestFilters(filters)`**
   - Builds Sequelize WHERE clause for request search
   - Supports comprehensive filtering options

5. **`calculateDuration(startDate, endDate)`**
   - Calculates hours between two dates
   - Returns decimal hours

6. **`sanitizeUser(user)`**
   - Removes sensitive data (password, googleId) from user object
   - Returns clean user data for API responses

---

## 🗄️ Database Schema

### **Database: MySQL**

All tables use snake_case for column names (converted from camelCase in models).

---

### **Table: `users`**
**Purpose**: User accounts and authentication

```sql
user_id (PK, INT, AUTO_INCREMENT)      - Unique identifier
full_name (VARCHAR(255), NOT NULL)     - Display name
email (VARCHAR(255), UNIQUE, NOT NULL) - Login email
password (VARCHAR(255), NULL)          - Hashed password (null for Google users)
google_id (VARCHAR(255), UNIQUE, NULL) - Google account ID
auth_provider (ENUM, NOT NULL)         - 'local' or 'google'
profile_picture (VARCHAR(500), NULL)   - Avatar URL
role (ENUM, NOT NULL, DEFAULT 'user')  - 'admin', 'manager', 'technician', 'user'
created_at (DATETIME, NOT NULL)        - Creation timestamp
updated_at (DATETIME, NOT NULL)        - Last update timestamp

INDEXES:
- UNIQUE(email)
- UNIQUE(google_id)
```

---

### **Table: `departments`**
**Purpose**: Company departments/organizational units

```sql
department_id (PK, INT, AUTO_INCREMENT)      - Unique identifier
department_name (VARCHAR(255), UNIQUE, NOT NULL) - Department name
description (TEXT, NULL)                     - Department details
created_at (DATETIME, NOT NULL)              - Creation timestamp

INDEXES:
- UNIQUE(department_name)
```

---

### **Table: `maintenance_teams`**
**Purpose**: Maintenance teams (groups of technicians)

```sql
team_id (PK, INT, AUTO_INCREMENT)      - Unique identifier
team_name (VARCHAR(255), UNIQUE, NOT NULL) - Team name
description (TEXT, NULL)                - Team details
created_at (DATETIME, NOT NULL)        - Creation timestamp
updated_at (DATETIME, NOT NULL)        - Last update timestamp

INDEXES:
- UNIQUE(team_name)
```

---

### **Table: `team_members`**
**Purpose**: Junction table for User ↔ Team (many-to-many)

```sql
team_member_id (PK, INT, AUTO_INCREMENT) - Unique identifier
team_id (FK, INT, NOT NULL)              - References maintenance_teams.team_id
user_id (FK, INT, NOT NULL)              - References users.user_id
is_lead (BOOLEAN, DEFAULT FALSE)         - Is team leader?
joined_at (DATETIME, NOT NULL)           - When joined team

INDEXES:
- UNIQUE(team_id, user_id) - Can't join same team twice
- FOREIGN KEY (team_id) REFERENCES maintenance_teams(team_id) ON DELETE CASCADE
- FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
```

---

### **Table: `equipment_categories`**
**Purpose**: Equipment classifications/types

```sql
category_id (PK, INT, AUTO_INCREMENT)      - Unique identifier
category_name (VARCHAR(255), UNIQUE, NOT NULL) - Category name
description (TEXT, NULL)                   - Category details
created_at (DATETIME, NOT NULL)            - Creation timestamp

INDEXES:
- UNIQUE(category_name)
```

---

### **Table: `equipment`** ⭐
**Purpose**: Company assets/machines

```sql
equipment_id (PK, INT, AUTO_INCREMENT)           - Unique identifier
equipment_name (VARCHAR(255), NOT NULL)          - Equipment name
serial_number (VARCHAR(255), UNIQUE, NOT NULL)   - Serial number
category_id (FK, INT, NOT NULL)                  - References equipment_categories.category_id
department_id (FK, INT, NULL)                    - References departments.department_id
assigned_to_user_id (FK, INT, NULL)              - References users.user_id
maintenance_team_id (FK, INT, NOT NULL)          - References maintenance_teams.team_id
default_technician_id (FK, INT, NULL)            - References users.user_id
purchase_date (DATE, NULL)                       - Purchase date
warranty_expiry_date (DATE, NULL)                - Warranty expiration
location (VARCHAR(500), NULL)                    - Physical location
status (ENUM, NOT NULL, DEFAULT 'active')        - 'active', 'under_maintenance', 'scrapped'
created_at (DATETIME, NOT NULL)                  - Creation timestamp
updated_at (DATETIME, NOT NULL)                  - Last update timestamp

INDEXES:
- UNIQUE(serial_number)
- FOREIGN KEY (category_id) REFERENCES equipment_categories(category_id)
- FOREIGN KEY (department_id) REFERENCES departments(department_id)
- FOREIGN KEY (assigned_to_user_id) REFERENCES users(user_id)
- FOREIGN KEY (maintenance_team_id) REFERENCES maintenance_teams(team_id)
- FOREIGN KEY (default_technician_id) REFERENCES users(user_id)
```

---

### **Table: `maintenance_requests`** ⭐
**Purpose**: Maintenance work orders

```sql
request_id (PK, INT, AUTO_INCREMENT)          - Unique identifier
subject (VARCHAR(500), NOT NULL)              - Short description
description (TEXT, NULL)                      - Full details
equipment_id (FK, INT, NOT NULL)              - References equipment.equipment_id
category_id (FK, INT, NOT NULL)               - References equipment_categories.category_id
maintenance_team_id (FK, INT, NOT NULL)       - References maintenance_teams.team_id
request_type (ENUM, NOT NULL)                 - 'corrective' or 'preventive'
priority (ENUM, NOT NULL, DEFAULT 'medium')   - 'low', 'medium', 'high', 'urgent'
stage (ENUM, NOT NULL, DEFAULT 'new')         - 'new', 'in_progress', 'repaired', 'scrapped'
created_by_user_id (FK, INT, NOT NULL)        - References users.user_id
assigned_to_user_id (FK, INT, NULL)           - References users.user_id
scheduled_date (DATETIME, NULL)               - When to do maintenance
completed_date (DATETIME, NULL)               - When work finished
duration_hours (DECIMAL(5,2), NULL)           - How long work took
notes (TEXT, NULL)                            - Additional info
is_overdue (BOOLEAN, DEFAULT FALSE)           - Calculated overdue status
created_at (DATETIME, NOT NULL)               - Creation timestamp
updated_at (DATETIME, NOT NULL)               - Last update timestamp

INDEXES:
- FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id)
- FOREIGN KEY (category_id) REFERENCES equipment_categories(category_id)
- FOREIGN KEY (maintenance_team_id) REFERENCES maintenance_teams(team_id)
- FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
- FOREIGN KEY (assigned_to_user_id) REFERENCES users(user_id)
```

---

### **Table: `request_history`**
**Purpose**: Audit trail for request changes

```sql
history_id (PK, INT, AUTO_INCREMENT)          - Unique identifier
request_id (FK, INT, NOT NULL)                - References maintenance_requests.request_id
changed_by_user_id (FK, INT, NOT NULL)        - References users.user_id
field_changed (VARCHAR(100), NULL)            - Which field changed
old_value (TEXT, NULL)                        - Previous value
new_value (TEXT, NULL)                        - New value
changed_at (DATETIME, NOT NULL)               - When change occurred

INDEXES:
- FOREIGN KEY (request_id) REFERENCES maintenance_requests(request_id) ON DELETE CASCADE
- FOREIGN KEY (changed_by_user_id) REFERENCES users(user_id)
```

---

## 🔄 Key Relationships & Business Rules

### **Relationship Diagram**

```
┌─────────────┐
│    USERS    │
└──────┬──────┘
       │
       ├──────────────────────────┐
       │                          │
       │ creates/assigned       belongs to
       │                          │
┌──────▼──────────────┐    ┌──────▼──────┐
│ MAINTENANCE_REQUESTS│◄───│ TEAM_MEMBERS│
└──────┬──────────────┘    └──────┬──────┘
       │                          │
       │ for                   joins
       │                          │
┌──────▼──────────┐        ┌──────▼───────────┐
│   EQUIPMENT     │◄───────│ MAINTENANCE_TEAMS│
└──────┬──────────┘        └──────────────────┘
       │
       ├───────────┬────────────┐
       │           │            │
   belongs to  belongs to   belongs to
       │           │            │
┌──────▼──────┐┌──▼────────┐┌──▼───────────────┐
│ DEPARTMENTS ││CATEGORIES ││ REQUEST_HISTORY  │
└─────────────┘└───────────┘└──────────────────┘
```

---

### **Auto-Fill Flow** ⭐

When creating a maintenance request:

1. User selects Equipment (id: 1)
2. Backend fetches Equipment details:
   ```
   {
     equipmentId: 1,
     categoryId: 3,           // CNC Machines
     maintenanceTeamId: 1,    // Mechanics Team
     defaultTechnicianId: 5   // Alice (optional)
   }
   ```
3. Request is created with:
   ```
   {
     equipmentId: 1,              // User provided
     categoryId: 3,               // Auto-filled from equipment!
     maintenanceTeamId: 1,        // Auto-filled from equipment!
     createdByUserId: 2,          // Current user
     assignedToUserId: 5,         // Optional: defaultTechnicianId
     // ... other fields
   }
   ```

---

### **Request Lifecycle**

```
┌─────┐
│ NEW │
└──┬──┘
   │ (assign technician)
   ▼
┌─────────────┐
│ IN_PROGRESS │
└──┬──────────┘
   │
   ├─────────────────────┐
   │                     │
   │ (complete work)     │ (can't fix)
   │                     │
   ▼                     ▼
┌──────────┐      ┌───────────┐
│ REPAIRED │      │ SCRAPPED  │
└──────────┘      └───────────┘
```

**Stage Changes:**
- NEW → IN_PROGRESS: When assigned to technician
- IN_PROGRESS → REPAIRED: Work completed successfully
- IN_PROGRESS → SCRAPPED: Equipment can't be repaired
- REPAIRED/SCRAPPED: Sets `completedDate` automatically

---

### **Business Rules**

1. **Uniqueness Constraints:**
   - Email must be unique
   - Google ID must be unique (if provided)
   - Serial numbers must be unique
   - Department names must be unique
   - Team names must be unique
   - Category names must be unique
   - User can't join same team twice

2. **Required Fields:**
   - Equipment must have: name, serial number, category, maintenance team
   - Request must have: subject, equipment, category, team, type, creator
   - User must have: full name, email

3. **Cascading Deletes:**
   - Delete Team → Deletes all TeamMembers
   - Delete Request → Deletes all RequestHistory
   - Delete User → (Foreign keys may prevent if user has active records)

4. **Prevention Rules:**
   - Cannot delete category with equipment
   - Cannot delete equipment with requests
   - Cannot delete your own account
   - Google OAuth users cannot use password login

5. **Auto-Processing:**
   - Password hashing on create/update
   - Email lowercasing
   - Category/Team auto-fill from equipment
   - Overdue status calculation
   - History logging on request changes

---

## 🎯 Complete Request Flow Example

```
1. User logs in → auth.controllers.login()
   → Returns JWT token
   
2. User creates maintenance request
   → POST /api/requests
   → Body: { equipmentId: 1, subject: "Machine broken", ... }
   → request.controllers.createRequest()
   → Fetches equipment details
   → Auto-fills categoryId and maintenanceTeamId
   → Creates request with stage='new'
   → Returns 201 with request data

3. Manager views requests
   → GET /api/requests
   → request.controllers.getAllRequests()
   → Returns filtered list

4. Manager assigns technician
   → PATCH /api/requests/:id/assign
   → Body: { assignedToUserId: 5 }
   → request.controllers.assignRequest()
   → Updates request
   → Creates history entry
   → Changes stage to 'in_progress' if 'new'

5. Technician updates progress
   → PATCH /api/requests/:id/stage
   → Body: { stage: 'repaired', durationHours: 2.5 }
   → request.controllers.updateRequestStage()
   → Updates stage
   → Sets completedDate
   → Creates history entry
   → Returns updated request

6. Dashboard shows stats
   → GET /api/dashboard/stats
   → dashboard.controllers.getDashboardStats()
   → Aggregates data from multiple tables
   → Returns comprehensive statistics
```

---

## 🔐 Authentication & Authorization

### **Authentication (Who you are)**
- JWT tokens stored in `Authorization: Bearer <token>` header
- Tokens contain user ID and expire after configured time
- Google OAuth uses Passport.js strategy

### **Authorization (What you can do)**
- **Admin**: Full access to everything
- **Manager**: Can manage departments, teams, categories, equipment, requests
- **Technician**: Can update request stages, view assigned requests
- **User**: Can create requests, view own requests

### **Role Hierarchy**
```
Admin > Manager > Technician > User
```

---

## 📊 API Response Format

### **Success Response**
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Array of field errors"] // Optional
}
```

### **HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Set up Environment:**
   - Copy `.env.example` to `.env`
   - Fill in database credentials
   - Add Google OAuth credentials
   - Set JWT secret

3. **Start Server:**
   ```bash
   npm run dev    # Development (with auto-reload)
   npm start      # Production
   ```

4. **Database:**
   - Tables are created automatically on first run
   - Models sync with database on startup

---

## 📝 Notes

- All timestamps are stored in UTC
- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days (configurable)
- Sequelize automatically handles table creation/updates
- Foreign key constraints ensure data integrity
- History is logged for all request changes
- Email addresses are automatically lowercased

---

That's everything! Each file has a specific purpose, and they all work together to create a complete maintenance management system. 🚀
