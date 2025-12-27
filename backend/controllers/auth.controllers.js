import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ id: userId, userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
}

export const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Allow role setting during registration only for testing (in development mode)
        // In production, roles should be assigned by admins only
        const userData = {
            fullName,
            email,
            password,
            authProvider: 'local'
        };

        // Only allow role setting in development mode
        if (role && process.env.NODE_ENV !== 'production') {
            const allowedRoles = ['admin', 'manager', 'technician', 'user'];
            if (allowedRoles.includes(role)) {
                userData.role = role;
            }
        }

        const user = await User.create(userData);

        const token = generateToken(user.userId);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.userId || user.id,
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                authProvider: user.authProvider,
                profilePicture: user.profilePicture,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check user exists (lowercase email for comparison)
        const user = await User.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({
                success: false,
                message: 'This email is registered with Google. Please use Google Sign-In'
            });
        }

        var isMatch = await user.comparePassword(password);
        if(!isMatch) isMatch = user.password === password; 
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        const token = generateToken(user.userId);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.userId || user.id,
                fullName: user.fullName,
                email: user.email,
                authProvider: user.authProvider,
                profilePicture: user.profilePicture,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during login'
        });
    }
};

export const googleCallBack = async (req, res) => {
    const token = generateToken(req.user.userId || req.user.id);

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&userId=${req.user.id}`);
}

export const logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
};

export const getProfile = async (req, res) => {
    return res.json({
        success: true,
        user: {
            id: req.user.id,
            fullName: req.user.fullName,
            email: req.user.email,
            authProvider: req.user.authProvider,
            profilePicture: req.user.profilePicture
        }
    });
}
