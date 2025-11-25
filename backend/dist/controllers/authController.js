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
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/authService"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token }
    });
});
/**
 * Login user
 * POST /api/auth/login
 */
exports.login = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { user, token }
    });
});
/**
 * Get current authenticated user
 * GET /api/auth/me
 */
exports.getMe = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    // User is attached by authMiddleware
    const user = req.user;
    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { user }
    });
});
/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
exports.logout = (0, errorMiddleware_1.asyncHandler)(async (_req, res) => {
    // Since we use JWT, logout is handled client-side
    // This endpoint is for any server-side cleanup if needed
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});
