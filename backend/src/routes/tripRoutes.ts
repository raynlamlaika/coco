import { Router } from 'express';
import * as tripController from '../controllers/tripController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware, driverMiddleware } from '../middleware/adminMiddleware';
import { 
  createTripValidation, 
  mongoIdValidation, 
  paginationValidation, 
  validate 
} from '../middleware/validationMiddleware';

const router = Router();

/**
 * @route   GET /api/trips/stats
 * @desc    Get trip statistics
 * @access  Admin
 */
router.get('/stats', authMiddleware, adminMiddleware, tripController.getTripStats);

/**
 * @route   GET /api/trips/my-trips
 * @desc    Get current user's trips
 * @access  Protected
 */
router.get('/my-trips', authMiddleware, tripController.getMyTrips);

/**
 * @route   GET /api/trips/recommendations-for-user
 * @desc    Get trip recommendations for current user
 * @access  Protected
 */
router.get('/recommendations-for-user', authMiddleware, tripController.getTripsForUser);

/**
 * @route   POST /api/trips/group
 * @desc    Group trips together
 * @access  Protected
 */
router.post('/group', authMiddleware, tripController.groupTrips);

/**
 * @route   POST /api/trips
 * @desc    Create a new trip
 * @access  Protected (drivers only)
 */
router.post('/', authMiddleware, driverMiddleware, createTripValidation, validate, tripController.createTrip);

/**
 * @route   GET /api/trips
 * @desc    Get all trips with filtering
 * @access  Protected
 */
router.get('/', authMiddleware, paginationValidation, validate, tripController.getAllTrips);

/**
 * @route   GET /api/trips/:id
 * @desc    Get trip by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware, mongoIdValidation('id'), validate, tripController.getTripById);

/**
 * @route   PUT /api/trips/:id
 * @desc    Update trip
 * @access  Protected (driver only)
 */
router.put('/:id', authMiddleware, mongoIdValidation('id'), validate, tripController.updateTrip);

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete trip
 * @access  Protected (driver only)
 */
router.delete('/:id', authMiddleware, mongoIdValidation('id'), validate, tripController.deleteTrip);

/**
 * @route   POST /api/trips/:id/request
 * @desc    Request to join a trip
 * @access  Protected
 */
router.post('/:id/request', authMiddleware, mongoIdValidation('id'), validate, tripController.requestToJoin);

/**
 * @route   POST /api/trips/:id/confirm/:userId
 * @desc    Confirm a passenger request
 * @access  Protected (driver only)
 */
router.post(
  '/:id/confirm/:userId',
  authMiddleware,
  mongoIdValidation('id'),
  mongoIdValidation('userId'),
  validate,
  tripController.confirmRequest
);

/**
 * @route   POST /api/trips/:id/reject/:userId
 * @desc    Reject a passenger request
 * @access  Protected (driver only)
 */
router.post(
  '/:id/reject/:userId',
  authMiddleware,
  mongoIdValidation('id'),
  mongoIdValidation('userId'),
  validate,
  tripController.rejectRequest
);

/**
 * @route   GET /api/trips/:id/recommendations
 * @desc    Get trip recommendations for grouping
 * @access  Protected
 */
router.get('/:id/recommendations', authMiddleware, mongoIdValidation('id'), validate, tripController.getRecommendations);

export default router;
