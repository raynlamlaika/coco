"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverMiddleware = exports.adminMiddleware = void 0;
/**
 * Admin middleware
 * Checks if the authenticated user has admin role
 * Must be used after authMiddleware
 */
const adminMiddleware = (req, res, next) => {
    try {
        // Check if user is attached to request (should be done by authMiddleware)
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
            return;
        }
        // Check if user is admin
        if (req.user.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authorization error.'
        });
    }
};
exports.adminMiddleware = adminMiddleware;
/**
 * Driver middleware
 * Checks if the authenticated user is a driver
 * Must be used after authMiddleware
 */
const driverMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
            return;
        }
        if (!req.user.isDriver) {
            res.status(403).json({
                success: false,
                message: 'Access denied. Driver privileges required.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Driver middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authorization error.'
        });
    }
};
exports.driverMiddleware = driverMiddleware;
