import { Request, Response } from 'express';
import Message from '../models/Message';
import Trip from '../models/Trip';
import { asyncHandler } from '../middleware/errorMiddleware';

/**
 * Create a new message
 * POST /api/messages
 */
export const createMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { tripId, content } = req.body;
  const senderId = req.user!._id;

  // Verify trip exists
  const trip = await Trip.findById(tripId);
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
  const message = new Message({
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
export const getMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { tripId } = req.params;
  const { page, limit } = req.query;
  const userId = req.user!._id;

  // Verify trip exists
  const trip = await Trip.findById(tripId);
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
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 50;
  const skip = (pageNum - 1) * limitNum;

  // Get messages
  const [messages, total] = await Promise.all([
    Message.find({ trip: tripId })
      .populate('sender', '-password')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum),
    Message.countDocuments({ trip: tripId })
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
export const markAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { tripId } = req.params;
  const userId = req.user?._id;

  // Mark all unread messages in the trip as read (except user's own messages)
  await Message.updateMany(
    {
      trip: tripId,
      sender: { $ne: userId },
      read: false
    },
    { read: true }
  );

  res.status(200).json({
    success: true,
    message: 'Messages marked as read'
  });
});

/**
 * Get unread message count for user
 * GET /api/messages/unread-count
 */
export const getUnreadCount = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  // Get all trips where user is driver or passenger
  const trips = await Trip.find({
    $or: [
      { driver: userId },
      { passengers: userId }
    ]
  }).select('_id');

  const tripIds = trips.map(t => t._id);

  // Count unread messages in those trips (not sent by user)
  const count = await Message.countDocuments({
    trip: { $in: tripIds },
    sender: { $ne: userId },
    read: false
  });

  res.status(200).json({
    success: true,
    data: { count }
  });
});
