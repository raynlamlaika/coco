"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.markAsRead = exports.getMessages = exports.createMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const Trip_1 = __importDefault(require("../models/Trip"));
const errorMiddleware_1 = require("../middleware/errorMiddleware");
/**
 * Create a new message
 * POST /api/messages
 */
exports.createMessage = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { tripId, content } = req.body;
    const senderId = req.user._id;
    // Verify trip exists
    const trip = await Trip_1.default.findById(tripId);
    if (!trip) {
        res.status(404).json({
            success: false,
            message: 'Trip not found'
        });
        return;
    }
    // Verify user is driver or passenger
    const isDriver = trip.driver.toString() === senderId.toString();
    const isPassenger = trip.passengers.some(p => p.toString() === senderId.toString());
    if (!isDriver && !isPassenger) {
        res.status(403).json({
            success: false,
            message: 'You must be a driver or passenger to send messages'
        });
        return;
    }
    // Create message
    const message = new Message_1.default({
        trip: tripId,
        sender: senderId,
        content,
        timestamp: new Date()
    });
    await message.save();
    // Add message to trip
    trip.messages.push(message._id);
    await trip.save();
    // Populate sender
    await message.populate('sender', '-password');
    res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: { message }
    });
});
/**
 * Get messages for a trip
 * GET /api/messages/:tripId
 */
exports.getMessages = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { tripId } = req.params;
    const { page, limit } = req.query;
    const userId = req.user._id;
    // Verify trip exists
    const trip = await Trip_1.default.findById(tripId);
    if (!trip) {
        res.status(404).json({
            success: false,
            message: 'Trip not found'
        });
        return;
    }
    // Verify user is driver or passenger
    const isDriver = trip.driver.toString() === userId.toString();
    const isPassenger = trip.passengers.some(p => p.toString() === userId.toString());
    if (!isDriver && !isPassenger) {
        res.status(403).json({
            success: false,
            message: 'You must be a driver or passenger to view messages'
        });
        return;
    }
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;
    // Get messages
    const [messages, total] = await Promise.all([
        Message_1.default.find({ trip: tripId })
            .populate('sender', '-password')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limitNum),
        Message_1.default.countDocuments({ trip: tripId })
    ]);
    res.status(200).json({
        success: true,
        data: {
            messages: messages.reverse(), // Return in chronological order
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum)
        }
    });
});
/**
 * Mark messages as read
 * PUT /api/messages/:tripId/read
 */
exports.markAsRead = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const { tripId } = req.params;
    const userId = req.user?._id;
    // Mark all unread messages in the trip as read (except user's own messages)
    await Message_1.default.updateMany({
        trip: tripId,
        sender: { $ne: userId },
        read: false
    }, { read: true });
    res.status(200).json({
        success: true,
        message: 'Messages marked as read'
    });
});
/**
 * Get unread message count for user
 * GET /api/messages/unread-count
 */
exports.getUnreadCount = (0, errorMiddleware_1.asyncHandler)(async (req, res) => {
    const userId = req.user?._id;
    // Get all trips where user is driver or passenger
    const trips = await Trip_1.default.find({
        $or: [
            { driver: userId },
            { passengers: userId }
        ]
    }).select('_id');
    const tripIds = trips.map(t => t._id);
    // Count unread messages in those trips (not sent by user)
    const count = await Message_1.default.countDocuments({
        trip: { $in: tripIds },
        sender: { $ne: userId },
        read: false
    });
    res.status(200).json({
        success: true,
        data: { count }
    });
});
