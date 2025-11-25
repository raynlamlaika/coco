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
const tripController = __importStar(require("../controllers/tripController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/trips/stats
 * @desc    Get trip statistics
 * @access  Admin
 */
router.get('/stats', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, tripController.getTripStats);
/**
 * @route   GET /api/trips/my-trips
 * @desc    Get current user's trips
 * @access  Protected
 */
router.get('/my-trips', authMiddleware_1.authMiddleware, tripController.getMyTrips);
/**
 * @route   GET /api/trips/recommendations-for-user
 * @desc    Get trip recommendations for current user
 * @access  Protected
 */
router.get('/recommendations-for-user', authMiddleware_1.authMiddleware, tripController.getTripsForUser);
/**
 * @route   POST /api/trips/group
 * @desc    Group trips together
 * @access  Protected
 */
router.post('/group', authMiddleware_1.authMiddleware, tripController.groupTrips);
/**
 * @route   POST /api/trips
 * @desc    Create a new trip
 * @access  Protected (drivers only)
 */
router.post('/', authMiddleware_1.authMiddleware, adminMiddleware_1.driverMiddleware, validationMiddleware_1.createTripValidation, validationMiddleware_1.validate, tripController.createTrip);
/**
 * @route   GET /api/trips
 * @desc    Get all trips with filtering
 * @access  Protected
 */
router.get('/', authMiddleware_1.authMiddleware, validationMiddleware_1.paginationValidation, validationMiddleware_1.validate, tripController.getAllTrips);
/**
 * @route   GET /api/trips/:id
 * @desc    Get trip by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, tripController.getTripById);
/**
 * @route   PUT /api/trips/:id
 * @desc    Update trip
 * @access  Protected (driver only)
 */
router.put('/:id', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, tripController.updateTrip);
/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete trip
 * @access  Protected (driver only)
 */
router.delete('/:id', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, tripController.deleteTrip);
/**
 * @route   POST /api/trips/:id/request
 * @desc    Request to join a trip
 * @access  Protected
 */
router.post('/:id/request', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, tripController.requestToJoin);
/**
 * @route   POST /api/trips/:id/confirm/:userId
 * @desc    Confirm a passenger request
 * @access  Protected (driver only)
 */
router.post('/:id/confirm/:userId', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), (0, validationMiddleware_1.mongoIdValidation)('userId'), validationMiddleware_1.validate, tripController.confirmRequest);
/**
 * @route   POST /api/trips/:id/reject/:userId
 * @desc    Reject a passenger request
 * @access  Protected (driver only)
 */
router.post('/:id/reject/:userId', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), (0, validationMiddleware_1.mongoIdValidation)('userId'), validationMiddleware_1.validate, tripController.rejectRequest);
/**
 * @route   GET /api/trips/:id/recommendations
 * @desc    Get trip recommendations for grouping
 * @access  Protected
 */
router.get('/:id/recommendations', authMiddleware_1.authMiddleware, (0, validationMiddleware_1.mongoIdValidation)('id'), validationMiddleware_1.validate, tripController.getRecommendations);
exports.default = router;
