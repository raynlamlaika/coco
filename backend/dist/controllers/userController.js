"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.promoteToAdmin = exports.toggleBan = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const userService = __importStar(require("../services/userService"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
/**
 * Get all users (admin only)
 * GET /api/users
 */
exports.getAllUsers = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { page, limit, search, role } = req.query;
    const result = await userService.getAllUsers({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search: search,
        role: role
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
/**
 * Get user by ID
 * GET /api/users/:id
 */
exports.getUserById = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { user }
    });
});
/**
 * Update user profile
 * PUT /api/users/:id
 */
exports.updateUser = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    // Check if user is updating their own profile or is admin
    if (req.user?._id.toString() !== id && req.user?.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'You can only update your own profile'
        });
        return;
    }
    const user = await userService.updateUser(id, req.body);
    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user }
    });
});
/**
 * Delete user (admin only)
 * DELETE /api/users/:id
 */
exports.deleteUser = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});
/**
 * Ban/unban user (admin only)
 * PUT /api/users/:id/ban
 */
exports.toggleBan = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { isBanned } = req.body;
    if (typeof isBanned !== 'boolean') {
        res.status(400).json({
            success: false,
            message: 'isBanned must be a boolean'
        });
        return;
    }
    const user = await userService.setBanStatus(id, isBanned);
    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: isBanned ? 'User banned successfully' : 'User unbanned successfully',
        data: { user }
    });
});
/**
 * Promote user to admin (admin only)
 * PUT /api/users/:id/promote
 */
exports.promoteToAdmin = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const user = await userService.promoteToAdmin(id);
    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'User promoted to admin successfully',
        data: { user }
    });
});
/**
 * Get user statistics (admin only)
 * GET /api/users/stats
 */
exports.getUserStats = (0, errorMiddleware_1.asyncHandler)(async (_req, res) => {
    const stats = await userService.getUserStats();
    res.status(200).json({
        success: true,
        data: { stats }
    });
});
