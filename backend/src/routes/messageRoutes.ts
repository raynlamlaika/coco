import { Router } from 'express';
import * as messageController from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';
import { 
  createMessageValidation, 
  mongoIdValidation, 
  paginationValidation, 
  validate 
} from '../middleware/validationMiddleware';

const router = Router();

/**
 * @route   GET /api/messages/unread-count
 * @desc    Get unread message count for current user
 * @access  Protected
 */
router.get('/unread-count', authMiddleware, messageController.getUnreadCount);

/**
 * @route   POST /api/messages
 * @desc    Create a new message
 * @access  Protected (driver or passenger)
 */
router.post('/', authMiddleware, createMessageValidation, validate, messageController.createMessage);

/**
 * @route   GET /api/messages/:tripId
 * @desc    Get messages for a trip
 * @access  Protected (driver or passenger)
 */
router.get('/:tripId', authMiddleware, mongoIdValidation('tripId'), paginationValidation, validate, messageController.getMessages);

/**
 * @route   PUT /api/messages/:tripId/read
 * @desc    Mark messages as read
 * @access  Protected (driver or passenger)
 */
router.put('/:tripId/read', authMiddleware, mongoIdValidation('tripId'), validate, messageController.markAsRead);

export default router;
