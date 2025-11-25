"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTripStats = exports.getUserTrips = exports.groupTrips = exports.rejectRequest = exports.confirmRequest = exports.requestToJoin = exports.deleteTrip = exports.updateTrip = exports.getTripById = exports.getAllTrips = exports.createTrip = void 0;
const Trip_1 = __importDefault(require("../models/Trip"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
/**
 * Create a new trip
 * @param data - Trip creation data
 * @returns Created trip
 */
const createTrip = async (data) => {
    // Verify driver exists and is actually a driver
    const driver = await User_1.default.findById(data.driver);
    if (!driver) {
        throw new Error('Driver not found');
    }
    if (!driver.isDriver) {
        throw new Error('User is not registered as a driver');
    }
    const trip = new Trip_1.default(data);
    await trip.save();
    return trip.populate([
        { path: 'driver', select: '-password' },
        { path: 'match' }
    ]);
};
exports.createTrip = createTrip;
/**
 * Get all trips with filtering and pagination
 * @param options - Filter options
 * @returns Paginated trip list
 */
const getAllTrips = async (options) => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    // Build query
    const query = {};
    if (options.match) {
        query.match = new mongoose_1.Types.ObjectId(options.match);
    }
    if (options.departureLocation) {
        query.departureLocation = new RegExp(options.departureLocation, 'i');
    }
    if (options.status) {
        query.status = options.status;
    }
    if (options.driver) {
        query.driver = new mongoose_1.Types.ObjectId(options.driver);
    }
    if (options.passenger) {
        query.passengers = new mongoose_1.Types.ObjectId(options.passenger);
    }
    if (options.fromDate || options.toDate) {
        query.departureTime = {};
        if (options.fromDate) {
            query.departureTime.$gte = options.fromDate;
        }
        if (options.toDate) {
            query.departureTime.$lte = options.toDate;
        }
    }
    // Execute query
    const [trips, total] = await Promise.all([
        Trip_1.default.find(query)
            .populate('driver', '-password')
            .populate('match')
            .populate('passengers', '-password')
            .skip(skip)
            .limit(limit)
            .sort({ departureTime: 1 }),
        Trip_1.default.countDocuments(query)
    ]);
    return {
        data: trips,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
};
exports.getAllTrips = getAllTrips;
/**
 * Get trip by ID
 * @param tripId - Trip ID
 * @returns Trip with populated references
 */
const getTripById = async (tripId) => {
    return Trip_1.default.findById(tripId)
        .populate('driver', '-password')
        .populate('match')
        .populate('passengers', '-password')
        .populate('requests.user', '-password')
        .populate('groupedWith');
};
exports.getTripById = getTripById;
/**
 * Update trip
 * @param tripId - Trip ID
 * @param userId - User ID (must be driver)
 * @param updateData - Update data
 * @returns Updated trip
 */
const updateTrip = async (tripId, userId, updateData) => {
    const trip = await Trip_1.default.findById(tripId);
    if (!trip) {
        throw new Error('Trip not found');
    }
    // Check if user is the driver
    if (trip.driver.toString() !== userId) {
        throw new Error('Only the driver can update this trip');
    }
    // Update trip
    Object.assign(trip, updateData);
    await trip.save();
    return trip.populate([
        { path: 'driver', select: '-password' },
        { path: 'match' },
        { path: 'passengers', select: '-password' }
    ]);
};
exports.updateTrip = updateTrip;
/**
 * Delete trip
 * @param tripId - Trip ID
 * @param userId - User ID (must be driver)
 * @returns Deleted trip
 */
const deleteTrip = async (tripId, userId) => {
    const trip = await Trip_1.default.findById(tripId);
    if (!trip) {
        throw new Error('Trip not found');
    }
    // Check if user is the driver
    if (trip.driver.toString() !== userId) {
        throw new Error('Only the driver can delete this trip');
    }
    return Trip_1.default.findByIdAndDelete(tripId);
};
exports.deleteTrip = deleteTrip;
/**
 * Request to join a trip
 * @param tripId - Trip ID
 * @param userId - User ID
 * @returns Updated trip
 */
const requestToJoin = async (tripId, userId) => {
    const trip = await Trip_1.default.findById(tripId);
    if (!trip) {
        throw new Error('Trip not found');
    }
    // Check if trip has available seats
    if (trip.availableSeats <= 0) {
        throw new Error('No available seats');
    }
    // Check if user is the driver
    if (trip.driver.toString() === userId) {
        throw new Error('Driver cannot request to join their own trip');
    }
    // Check if user already requested
    const existingRequest = trip.requests.find(r => r.user.toString() === userId);
    if (existingRequest) {
        throw new Error('You have already requested to join this trip');
    }
    // Check if user is already a passenger
    if (trip.passengers.some(p => p.toString() === userId)) {
        throw new Error('You are already a passenger on this trip');
    }
    // Add request
    trip.requests.push({
        user: new mongoose_1.Types.ObjectId(userId),
        status: 'pending',
        requestedAt: new Date()
    });
    await trip.save();
    return trip.populate([
        { path: 'driver', select: '-password' },
        { path: 'match' },
        { path: 'requests.user', select: '-password' }
    ]);
};
exports.requestToJoin = requestToJoin;
/**
 * Confirm a passenger request
 * @param tripId - Trip ID
 * @param driverId - Driver user ID
 * @param passengerId - Passenger user ID
 * @returns Updated trip
 */
const confirmRequest = async (tripId, driverId, passengerId) => {
    const trip = await Trip_1.default.findById(tripId);
    if (!trip) {
        throw new Error('Trip not found');
    }
    // Check if user is the driver
    if (trip.driver.toString() !== driverId) {
        throw new Error('Only the driver can confirm requests');
    }
    // Use the model method
    await trip.confirmRequest(new mongoose_1.Types.ObjectId(passengerId));
    return trip.populate([
        { path: 'driver', select: '-password' },
        { path: 'match' },
        { path: 'passengers', select: '-password' },
        { path: 'requests.user', select: '-password' }
    ]);
};
exports.confirmRequest = confirmRequest;
/**
 * Reject a passenger request
 * @param tripId - Trip ID
 * @param driverId - Driver user ID
 * @param passengerId - Passenger user ID
 * @returns Updated trip
 */
const rejectRequest = async (tripId, driverId, passengerId) => {
    const trip = await Trip_1.default.findById(tripId);
    if (!trip) {
        throw new Error('Trip not found');
    }
    // Check if user is the driver
    if (trip.driver.toString() !== driverId) {
        throw new Error('Only the driver can reject requests');
    }
    // Use the model method
    await trip.rejectRequest(new mongoose_1.Types.ObjectId(passengerId));
    return trip.populate([
        { path: 'driver', select: '-password' },
        { path: 'match' },
        { path: 'requests.user', select: '-password' }
    ]);
};
exports.rejectRequest = rejectRequest;
/**
 * Group trips together
 * @param tripIds - Array of trip IDs to group
 * @returns Updated trips
 */
const groupTrips = async (tripIds) => {
    if (tripIds.length < 2) {
        throw new Error('At least 2 trips required for grouping');
    }
    const trips = await Trip_1.default.find({ _id: { $in: tripIds } });
    if (trips.length !== tripIds.length) {
        throw new Error('Some trips not found');
    }
    // Update each trip with grouping info
    for (const trip of trips) {
        trip.isGrouped = true;
        trip.groupedWith = tripIds
            .filter(id => id !== trip._id.toString())
            .map(id => new mongoose_1.Types.ObjectId(id));
        await trip.save();
    }
    return Trip_1.default.find({ _id: { $in: tripIds } })
        .populate('driver', '-password')
        .populate('match')
        .populate('groupedWith');
};
exports.groupTrips = groupTrips;
/**
 * Get trips by user (as driver or passenger)
 * @param userId - User ID
 * @returns Object with trips as driver and passenger
 */
const getUserTrips = async (userId) => {
    const [asDriver, asPassenger, requests] = await Promise.all([
        Trip_1.default.find({ driver: userId })
            .populate('driver', '-password')
            .populate('match')
            .populate('passengers', '-password')
            .populate('requests.user', '-password')
            .sort({ departureTime: 1 }),
        Trip_1.default.find({ passengers: userId })
            .populate('driver', '-password')
            .populate('match')
            .sort({ departureTime: 1 }),
        Trip_1.default.find({ 'requests.user': userId, 'requests.status': 'pending' })
            .populate('driver', '-password')
            .populate('match')
            .sort({ departureTime: 1 })
    ]);
    return { asDriver, asPassenger, requests };
};
exports.getUserTrips = getUserTrips;
/**
 * Get trip statistics
 * @returns Trip statistics
 */
const getTripStats = async () => {
    const [total, pending, confirmed, completed, cancelled] = await Promise.all([
        Trip_1.default.countDocuments(),
        Trip_1.default.countDocuments({ status: 'pending' }),
        Trip_1.default.countDocuments({ status: 'confirmed' }),
        Trip_1.default.countDocuments({ status: 'completed' }),
        Trip_1.default.countDocuments({ status: 'cancelled' })
    ]);
    return { total, pending, confirmed, completed, cancelled };
};
exports.getTripStats = getTripStats;
