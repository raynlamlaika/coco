"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoGroupTrips = exports.findBestTripsForUser = exports.getRecommendations = void 0;
const Trip_1 = __importDefault(require("../models/Trip"));
const User_1 = __importDefault(require("../models/User"));
const scoringAlgorithm_1 = require("../utils/scoringAlgorithm");
/**
 * Get trip grouping recommendations for a specific trip
 * @param tripId - Trip ID to get recommendations for
 * @returns Array of recommended trips with scores
 */
const getRecommendations = async (tripId) => {
    // Get the target trip
    const targetTrip = await Trip_1.default.findById(tripId)
        .populate('driver', '-password')
        .populate('match');
    if (!targetTrip) {
        throw new Error('Trip not found');
    }
    const targetDriver = targetTrip.driver;
    // Find other trips for the same match that are not cancelled
    const otherTrips = await Trip_1.default.find({
        _id: { $ne: tripId },
        match: targetTrip.match,
        status: { $ne: 'cancelled' }
    })
        .populate('driver', '-password')
        .populate('match');
    const recommendations = [];
    for (const otherTrip of otherTrips) {
        const otherDriver = otherTrip.driver;
        // Calculate compatibility score
        const score = (0, scoringAlgorithm_1.calculateCompatibilityScore)(targetTrip, otherTrip, targetDriver, otherDriver);
        // Check if score meets threshold
        if ((0, scoringAlgorithm_1.shouldSuggestGrouping)(score)) {
            // Determine matched criteria
            const matchedCriteria = [];
            if (targetTrip.departureLocation.toLowerCase() === otherTrip.departureLocation.toLowerCase()) {
                matchedCriteria.push('Same departure location');
            }
            const timeDiff = Math.abs(new Date(targetTrip.departureTime).getTime() - new Date(otherTrip.departureTime).getTime());
            if (timeDiff <= 30 * 60 * 1000) {
                matchedCriteria.push('Similar departure time');
            }
            if (targetDriver.favouriteTeam.toLowerCase() === otherDriver.favouriteTeam.toLowerCase()) {
                matchedCriteria.push('Same favourite team');
            }
            if (targetDriver.supporterGroup.toLowerCase() === otherDriver.supporterGroup.toLowerCase()) {
                matchedCriteria.push('Same supporter group');
            }
            if (targetDriver.region.toLowerCase() === otherDriver.region.toLowerCase()) {
                matchedCriteria.push('Same region');
            }
            const interests1 = new Set(targetDriver.interests.map((i) => i.toLowerCase()));
            const overlapping = otherDriver.interests.filter((i) => interests1.has(i.toLowerCase()));
            if (overlapping.length > 0) {
                matchedCriteria.push(`${overlapping.length} shared interest(s)`);
            }
            recommendations.push({
                trip: otherTrip,
                score,
                matchedCriteria
            });
        }
    }
    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score);
};
exports.getRecommendations = getRecommendations;
/**
 * Find best trips to join for a user
 * @param userId - User ID looking for trips
 * @param matchId - Match ID to filter by
 * @returns Array of recommended trips with scores
 */
const findBestTripsForUser = async (userId, matchId) => {
    // Get user
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Build query
    const query = {
        driver: { $ne: userId },
        passengers: { $ne: userId },
        availableSeats: { $gt: 0 },
        status: { $in: ['pending', 'confirmed'] }
    };
    if (matchId) {
        query.match = matchId;
    }
    else {
        // Only upcoming matches
        query.departureTime = { $gte: new Date() };
    }
    // Find trips
    const trips = await Trip_1.default.find(query)
        .populate('driver', '-password')
        .populate('match');
    const recommendations = [];
    for (const trip of trips) {
        const driver = trip.driver;
        // Calculate user-to-driver compatibility
        let score = 0;
        const matchedCriteria = [];
        // Same favourite team
        if (user.favouriteTeam.toLowerCase() === driver.favouriteTeam.toLowerCase()) {
            score += 25;
            matchedCriteria.push('Same favourite team');
        }
        // Same supporter group
        if (user.supporterGroup.toLowerCase() === driver.supporterGroup.toLowerCase()) {
            score += 20;
            matchedCriteria.push('Same supporter group');
        }
        // Same region
        if (user.region.toLowerCase() === driver.region.toLowerCase()) {
            score += 15;
            matchedCriteria.push('Same region');
        }
        // Same city
        if (user.city.toLowerCase() === driver.city.toLowerCase()) {
            score += 15;
            matchedCriteria.push('Same city');
        }
        // Overlapping interests
        const userInterests = new Set(user.interests.map((i) => i.toLowerCase()));
        const overlapping = driver.interests.filter((i) => userInterests.has(i.toLowerCase()));
        if (overlapping.length > 0) {
            score += Math.min(overlapping.length * 5, 15);
            matchedCriteria.push(`${overlapping.length} shared interest(s)`);
        }
        // Same entry center
        if (user.entryCenter.toLowerCase() === driver.entryCenter.toLowerCase()) {
            score += 10;
            matchedCriteria.push('Same entry center');
        }
        recommendations.push({
            trip,
            score,
            matchedCriteria
        });
    }
    // Sort by score descending
    return recommendations.sort((a, b) => b.score - a.score);
};
exports.findBestTripsForUser = findBestTripsForUser;
/**
 * Auto-group trips that meet the threshold
 * @param matchId - Match ID to group trips for
 * @param threshold - Minimum compatibility score (default 70)
 * @returns Groups of trip IDs
 */
const autoGroupTrips = async (matchId, threshold = 70) => {
    // Get all trips for the match
    const trips = await Trip_1.default.find({
        match: matchId,
        status: { $ne: 'cancelled' },
        isGrouped: false
    }).populate('driver', '-password');
    // Build driver map
    const driverMap = new Map();
    for (const trip of trips) {
        driverMap.set(trip._id.toString(), trip.driver);
    }
    // Find groups
    const groups = [];
    const grouped = new Set();
    for (const trip of trips) {
        if (grouped.has(trip._id.toString()))
            continue;
        const group = [trip._id.toString()];
        const tripDriver = driverMap.get(trip._id.toString());
        for (const otherTrip of trips) {
            if (otherTrip._id.toString() === trip._id.toString())
                continue;
            if (grouped.has(otherTrip._id.toString()))
                continue;
            const otherDriver = driverMap.get(otherTrip._id.toString());
            const score = (0, scoringAlgorithm_1.calculateCompatibilityScore)(trip, otherTrip, tripDriver, otherDriver);
            if (score >= threshold) {
                group.push(otherTrip._id.toString());
            }
        }
        if (group.length > 1) {
            groups.push(group);
            group.forEach(id => grouped.add(id));
        }
    }
    return groups;
};
exports.autoGroupTrips = autoGroupTrips;
