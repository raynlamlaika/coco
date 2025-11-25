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
const express_1 = require("express");
const userController = __importStar(require("../controllers/userController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Admin
 */
router.get('/stats', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, userController.getUserStats);
/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Admin
 */
router.get('/', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, validationMiddleware_1.paginationValidation, validationMiddleware_1.validate, userController.getAllUsers);
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, userController.getUserById);
/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Protected (own profile or admin)
 */
router.put('/:id', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, userController.updateUser);
/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Admin
 */
router.delete('/:id', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, userController.deleteUser);
/**
 * @route   PUT /api/users/:id/ban
 * @desc    Ban/unban user
 * @access  Admin
 */
router.put('/:id/ban', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, userController.toggleBan);
/**
 * @route   PUT /api/users/:id/promote
 * @desc    Promote user to admin
 * @access  Admin
 */
router.put('/:id/promote', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, userController.promoteToAdmin);
exports.default = router;
