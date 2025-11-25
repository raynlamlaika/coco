"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = (0, jwt_1.extractToken)(req.headers.authorization);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
            return;
        }
        // Verify token
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token.'
            });
            return;
        }
        // Find user and attach to request
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found.'
            });
            return;
        }
        // Check if user is banned
        if (user.isBanned) {
            res.status(403).json({
                success: false,
                message: 'Your account has been banned.'
            });
            return;
        }
        // Attach user to request
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error.'
        });
    }
};
exports.authMiddleware = authMiddleware;
/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
const optionalAuthMiddleware = async (req, res, next) => {
    try {
        const token = (0, jwt_1.extractToken)(req.headers.authorization);
        if (token) {
            const decoded = (0, jwt_1.verifyToken)(token);
            if (decoded) {
                const user = await User_1.default.findById(decoded.userId).select('-password');
                if (user && !user.isBanned) {
                    req.user = user;
                }
            }
        }
        next();
    }
    catch {
        // Continue without user
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
