import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Get token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (handle both id and userId from JWT)
        const userId = decoded.id || decoded.userId;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found, authorization denied'
            });
        }

        // Attach user to request object
        const userJson = user.toJSON();
        // Ensure id is available for compatibility
        userJson.id = userJson.userId;
        req.user = userJson;
        
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};