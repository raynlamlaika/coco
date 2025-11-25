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
const messageController = __importStar(require("../controllers/messageController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/messages/unread-count
 * @desc    Get unread message count for current user
 * @access  Protected
 */
router.get('/unread-count', authMiddleware_1.authMiddleware, messageController.getUnreadCount);
/**
 * @route   POST /api/messages
 * @desc    Create a new message
 * @access  Protected (driver or passenger)
 */
router.post('/', authMiddleware_1.authMiddleware, validationMiddleware_1.createMessageValidation, validationMiddleware_1.validate, messageController.createMessage);
/**
 * @route   GET /api/messages/:tripId
 * @desc    Get messages for a trip
 * @access  Protected (driver or passenger)
 */
router.get('/:tripId', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('tripId'), validationMiddleware_1.paginationValidation, validationMiddleware_1.validate, messageController.getMessages);
/**
 * @route   PUT /api/messages/:tripId/read
 * @desc    Mark messages as read
 * @access  Protected (driver or passenger)
 */
router.put('/:tripId/read', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('tripId'), validationMiddleware_1.validate, messageController.markAsRead);
exports.default = router;
