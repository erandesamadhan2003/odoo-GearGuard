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

- User authentication (local + Google OAuth)
- Role-based access (Admin, Manager, Technician, User)
- Equipment management
- Maintenance request tracking
- Team and department management
- Dashboard with statistics and reports

## Database

The schema is defined in `backend/schema.sql`. Sequelize will auto-sync tables on startup.
