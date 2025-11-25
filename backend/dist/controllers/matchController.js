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
exports.getMatchStats = exports.getUpcomingMatches = exports.deleteMatch = exports.updateMatch = exports.getMatchById = exports.getAllMatches = exports.createMatch = void 0;
const matchService = __importStar(require("../services/matchService"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
/**
 * Create a new match (admin only)
 * POST /api/matches
 */
exports.createMatch = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const match = await matchService.createMatch(req.body);
    res.status(201).json({
        success: true,
        message: 'Match created successfully',
        data: { match }
    });
});
/**
 * Get all matches with filtering
 * GET /api/matches
 */
exports.getAllMatches = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { homeTeam, awayTeam, competition, isUpcoming, fromDate, toDate, page, limit } = req.query;
    const result = await matchService.getAllMatches({
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        competition: competition,
        isUpcoming: isUpcoming === 'true' ? true : isUpcoming === 'false' ? false : undefined,
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
 * Get match by ID
 * GET /api/matches/:id
 */
exports.getMatchById = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const match = await matchService.getMatchById(id);
    if (!match) {
        res.status(404).json({
            success: false,
            message: 'Match not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        data: { match }
    });
});
/**
 * Update match (admin only)
 * PUT /api/matches/:id
 */
exports.updateMatch = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const match = await matchService.updateMatch(id, req.body);
    if (!match) {
        res.status(404).json({
            success: false,
            message: 'Match not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'Match updated successfully',
        data: { match }
    });
});
/**
 * Delete match (admin only)
 * DELETE /api/matches/:id
 */
exports.deleteMatch = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const match = await matchService.deleteMatch(id);
    if (!match) {
        res.status(404).json({
            success: false,
            message: 'Match not found'
        });
        return;
    }
    res.status(200).json({
        success: true,
        message: 'Match deleted successfully'
    });
});
/**
 * Get upcoming matches
 * GET /api/matches/upcoming
 */
exports.getUpcomingMatches = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { limit } = req.query;
    const matches = await matchService.getUpcomingMatches(limit ? parseInt(limit) : undefined);
    res.status(200).json({
        success: true,
        data: { matches }
    });
});
/**
 * Get match statistics (admin only)
 * GET /api/matches/stats
 */
exports.getMatchStats = (0, errorMiddleware_1.asyncHandler)(async (_req, res) => {
    const stats = await matchService.getMatchStats();
    res.status(200).json({
        success: true,
        data: { stats }
    });
});
