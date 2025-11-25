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
const matchController = __importStar(require("../controllers/matchController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/matches/upcoming
 * @desc    Get upcoming matches
 * @access  Public
 */
router.get('/upcoming', matchController.getUpcomingMatches);
/**
 * @route   GET /api/matches/stats
 * @desc    Get match statistics
 * @access  Admin
 */
router.get('/stats', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, matchController.getMatchStats);
/**
 * @route   POST /api/matches
 * @desc    Create a new match
 * @access  Admin
 */
router.post('/', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, validationMiddleware_1.createMatchValidation, validationMiddleware_1.validate, matchController.createMatch);
/**
 * @route   GET /api/matches
 * @desc    Get all matches with filtering
 * @access  Public
 */
router.get('/', validationMiddleware_1.paginationValidation, validationMiddleware_1.validate, matchController.getAllMatches);
/**
 * @route   GET /api/matches/:id
 * @desc    Get match by ID
 * @access  Public
 */
router.get('/:id', (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, matchController.getMatchById);
/**
 * @route   PUT /api/matches/:id
 * @desc    Update match
 * @access  Admin
 */
router.put('/:id', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, matchController.updateMatch);
/**
 * @route   DELETE /api/matches/:id
 * @desc    Delete match
 * @access  Admin
 */
router.delete('/:id', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, matchController.deleteMatch);
exports.default = router;
