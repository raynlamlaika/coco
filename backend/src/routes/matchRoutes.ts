import { Router } from 'express';
import * as matchController from '../controllers/matchController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { 
  createMatchValidation, 
  mongoIdValidation, 
  paginationValidation, 
  validate 
} from '../middleware/validationMiddleware';

const router = Router();

/**
 * @route   GET /api/matches/upcoming
 * @desc    Get upcoming matches
 * @access  Public
 */
router.get('/upcoming', matchController.getUpcomingMatches);

/**
 * @route   GET /api/matches/stats
 * @desc    Get match statistics
 * @access  Admin
 */
router.get('/stats', authMiddleware, adminMiddleware, matchController.getMatchStats);

/**
 * @route   POST /api/matches
 * @desc    Create a new match
 * @access  Admin
 */
router.post('/', authMiddleware, adminMiddleware, createMatchValidation, validate, matchController.createMatch);

/**
 * @route   GET /api/matches
 * @desc    Get all matches with filtering
 * @access  Public
 */
router.get('/', paginationValidation, validate, matchController.getAllMatches);

/**
 * @route   GET /api/matches/:id
 * @desc    Get match by ID
 * @access  Public
 */
router.get('/:id', mongoIdValidation('id'), validate, matchController.getMatchById);

/**
 * @route   PUT /api/matches/:id
 * @desc    Update match
 * @access  Admin
 */
router.put('/:id', authMiddleware, adminMiddleware, mongoIdValidation('id'), validate, matchController.updateMatch);

/**
 * @route   DELETE /api/matches/:id
 * @desc    Delete match
 * @access  Admin
 */
router.delete('/:id', authMiddleware, adminMiddleware, mongoIdValidation('id'), validate, matchController.deleteMatch);

export default router;
