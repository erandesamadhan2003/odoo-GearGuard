import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';

import connectDB from './config/db.js';
import { configurePassport } from './config/passport.js';
import { errorHandler, notFound } from './middleware/errorHandler.middleware.js';

// Routes
import indexRoutes from './routes/index.routes.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import departmentRoutes from './routes/department.routes.js';
import teamRoutes from './routes/team.routes.js';
import categoryRoutes from './routes/category.routes.js';
import equipmentRoutes from './routes/equipment.routes.js';
import requestRoutes from './routes/request.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

dotenv.config();
connectDB();

const app = express();

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

/* ---------- Routes ---------- */
app.use('/', indexRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* ---------- Error Handling ---------- */
app.use(notFound);
app.use(errorHandler);

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
