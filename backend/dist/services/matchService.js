"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchStats = exports.updatePastMatches = exports.getUpcomingMatches = exports.deleteMatch = exports.updateMatch = exports.getMatchById = exports.getAllMatches = exports.createMatch = void 0;
const Match_1 = __importDefault(require("../models/Match"));
/**
 * Create a new match
 * @param data - Match creation data
 * @returns Created match
 */
const createMatch = async (data) => {
    const match = new Match_1.default({
        ...data,
        isUpcoming: data.isUpcoming ?? true
    });
    await match.save();
    return match;
};
exports.createMatch = createMatch;
/**
 * Get all matches with filtering and pagination
 * @param options - Filter options
 * @returns Paginated match list
 */
const getAllMatches = async (options) => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    // Build query
    const query = {};
    if (options.homeTeam) {
        query.homeTeam = new RegExp(options.homeTeam, 'i');
    }
    if (options.awayTeam) {
        query.awayTeam = new RegExp(options.awayTeam, 'i');
    }
    if (options.competition) {
        query.competition = new RegExp(options.competition, 'i');
    }
    if (options.isUpcoming !== undefined) {
        query.isUpcoming = options.isUpcoming;
    }
    if (options.fromDate || options.toDate) {
        query.matchDate = {};
        if (options.fromDate) {
            query.matchDate.$gte = options.fromDate;
        }
        if (options.toDate) {
            query.matchDate.$lte = options.toDate;
        }
    }
    // Execute query
    const [matches, total] = await Promise.all([
        Match_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ matchDate: 1 }),
        Match_1.default.countDocuments(query)
    ]);
    return {
        data: matches,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
};
exports.getAllMatches = getAllMatches;
/**
 * Get match by ID
 * @param matchId - Match ID
 * @returns Match
 */
const getMatchById = async (matchId) => {
    return Match_1.default.findById(matchId);
};
exports.getMatchById = getMatchById;
/**
 * Update match
 * @param matchId - Match ID
 * @param updateData - Update data
 * @returns Updated match
 */
const updateMatch = async (matchId, updateData) => {
    return Match_1.default.findByIdAndUpdate(matchId, { $set: updateData }, { new: true, runValidators: true });
};
exports.updateMatch = updateMatch;
/**
 * Delete match
 * @param matchId - Match ID
 * @returns Deleted match
 */
const deleteMatch = async (matchId) => {
    return Match_1.default.findByIdAndDelete(matchId);
};
exports.deleteMatch = deleteMatch;
/**
 * Get upcoming matches
 * @param limit - Maximum number of matches to return
 * @returns Array of upcoming matches
 */
const getUpcomingMatches = async (limit = 10) => {
    return Match_1.default.find({
        isUpcoming: true,
        matchDate: { $gte: new Date() }
    })
        .sort({ matchDate: 1 })
        .limit(limit);
};
exports.getUpcomingMatches = getUpcomingMatches;
/**
 * Mark past matches as not upcoming
 * This can be called by a scheduled job
 */
const updatePastMatches = async () => {
    const result = await Match_1.default.updateMany({
        matchDate: { $lt: new Date() },
        isUpcoming: true
    }, { isUpcoming: false });
    return result.modifiedCount;
};
exports.updatePastMatches = updatePastMatches;
/**
 * Get match statistics
 * @returns Match statistics
 */
const getMatchStats = async () => {
    const [total, upcoming, past] = await Promise.all([
        Match_1.default.countDocuments(),
        Match_1.default.countDocuments({ isUpcoming: true }),
        Match_1.default.countDocuments({ isUpcoming: false })
    ]);
    return { total, upcoming, past };
};
exports.getMatchStats = getMatchStats;
