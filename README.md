# ODOO HACKATHON
# GearGuard

Maintenance management system for tracking equipment and maintenance requests.

## Tech Stack

**Backend:**
- Node.js + Express
- MySQL (Sequelize ORM)
- JWT authentication
- Google OAuth

**Frontend:**
- React + Vite
- Redux Toolkit
- Tailwind CSS

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development

# Database (Railway MySQL)
DB_HOST=your_host
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway

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

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Features

### Core Functionality
- ✅ User authentication (local + Google OAuth)
- ✅ Role-based access control (Admin, Manager, Technician, User)
- ✅ Equipment tracking by Department and Employee
- ✅ Maintenance Teams with member management
- ✅ Maintenance Requests (Corrective & Preventive)
- ✅ Kanban Board with drag-and-drop functionality
- ✅ Calendar View for scheduled maintenance
- ✅ Analytics Dashboard with charts and reports
- ✅ Smart buttons on Equipment form (shows request count)
- ✅ Auto-scrap logic (marks equipment as scrapped when request is scrapped)

### Role Permissions
- **Admin/Manager**: Full access - Create/Edit/Delete equipment, teams, categories, departments
- **Technician**: View assigned requests, update request stages
- **User**: Create requests, view own requests

### UI Features
- Modern, responsive design with Tailwind CSS
- Drag-and-drop Kanban board
- Real-time updates
- Professional request detail pages
- Role-based UI visibility

## Database

The schema is defined in `backend/schema.sql`. Sequelize will auto-sync tables on startup.
