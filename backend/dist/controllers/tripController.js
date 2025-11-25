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
exports.getTripStats = exports.getTripsForUser = exports.getMyTrips = exports.groupTrips = exports.getRecommendations = exports.rejectRequest = exports.confirmRequest = exports.requestToJoin = exports.deleteTrip = exports.updateTrip = exports.getTripById = exports.getAllTrips = exports.createTrip = void 0;
const tripService = __importStar(require("../services/tripService"));
const recommendationService = __importStar(require("../services/recommendationService"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
/**
 * Create a new trip
 * POST /api/trips
 */
exports.createTrip = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const tripData = {
        ...req.body,
        driver: req.user?._id
    };
    const trip = await tripService.createTrip(tripData);
    res.status(201).json({
        success: true,
        message: 'Trip created successfully',
        data: { trip }
    });
});
/**
 * Get all trips with filtering
 * GET /api/trips
 */
exports.getAllTrips = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { match, departureLocation, status, driver, passenger, fromDate, toDate, page, limit } = req.query;
    const result = await tripService.getAllTrips({
        match: match,
        departureLocation: departureLocation,
        status: status,
        driver: driver,
        passenger: passenger,
        fromDate: fromDate ? new Date(fromDate) : undefined,
        toDate: toDate ? new Date(toDate) : undefined,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined
    });
    res.status(200).json({
        success: true,
        data: result
    });
});
/**
 * Get trip by ID
 * GET /api/trips/:id
 */
exports.getTripById = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const trip = await tripService.getTripById(id);
    if (!trip) {
        res.status(404).json({
            success: false,
            message: 'Trip not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { trip }
    });
});
/**
 * Update trip
 * PUT /api/trips/:id
 */
exports.updateTrip = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const trip = await tripService.updateTrip(id, req.user._id.toString(), req.body);
    if (!trip) {
        res.status(404).json({
            success: false,
            message: 'Trip not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'Trip updated successfully',
        data: { trip }
    });
});
/**
 * Delete trip
 * DELETE /api/trips/:id
 */
exports.deleteTrip = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await tripService.deleteTrip(id, req.user._id.toString());
    res.status(200).json({
        success: true,
        message: 'Trip deleted successfully'
    });
});
/**
 * Request to join a trip
 * POST /api/trips/:id/request
 */
exports.requestToJoin = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const trip = await tripService.requestToJoin(id, req.user._id.toString());
    res.status(200).json({
        success: true,
        message: 'Request sent successfully',
        data: { trip }
    });
});
/**
 * Confirm a passenger request
 * POST /api/trips/:id/confirm/:userId
 */
exports.confirmRequest = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id, userId } = req.params;
    const trip = await tripService.confirmRequest(id, req.user._id.toString(), userId);
    res.status(200).json({
        success: true,
        message: 'Request confirmed successfully',
        data: { trip }
    });
});
/**
 * Reject a passenger request
 * POST /api/trips/:id/reject/:userId
 */
exports.rejectRequest = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id, userId } = req.params;
    const trip = await tripService.rejectRequest(id, req.user._id.toString(), userId);
    res.status(200).json({
        success: true,
        message: 'Request rejected successfully',
        data: { trip }
    });
});
/**
 * Get trip recommendations for grouping
 * GET /api/trips/:id/recommendations
 */
exports.getRecommendations = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const recommendations = await recommendationService.getRecommendations(id);
    res.status(200).json({
        success: true,
        data: { recommendations }
    });
});
/**
 * Group trips together
 * POST /api/trips/group
 */
exports.groupTrips = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { tripIds } = req.body;
    if (!Array.isArray(tripIds) || tripIds.length < 2) {
        res.status(400).json({
            success: false,
            message: 'At least 2 trip IDs are required'
        });
        return;
    }
    const trips = await tripService.groupTrips(tripIds);
    res.status(200).json({
        success: true,
        message: 'Trips grouped successfully',
        data: { trips }
    });
});
/**
 * Get user's trips (as driver and passenger)
 * GET /api/trips/my-trips
 */
exports.getMyTrips = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const trips = await tripService.getUserTrips(req.user._id.toString());
    res.status(200).json({
        success: true,
        data: trips
    });
});
/**
 * Find best trips for user
 * GET /api/trips/recommendations-for-user
 */
exports.getTripsForUser = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { matchId } = req.query;
    const recommendations = await recommendationService.findBestTripsForUser(req.user._id.toString(), matchId);
    res.status(200).json({
        success: true,
        data: { recommendations }
    });
});
/**
 * Get trip statistics (admin only)
 * GET /api/trips/stats
 */
exports.getTripStats = (0, errorMiddleware_1.asyncHandler)(async (_req, res) => {
    const stats = await tripService.getTripStats();
    res.status(200).json({
        success: true,
        data: { stats }
    });
});
