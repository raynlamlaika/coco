import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { mongoIdValidation, paginationValidation, validate } from '../middleware/validationMiddleware';

const router = Router();

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Admin
 */
router.get('/stats', authMiddleware, adminMiddleware, userController.getUserStats);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Admin
 */
router.get('/', authMiddleware, adminMiddleware, paginationValidation, validate, userController.getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected
 */
router.get('/:id', authMiddleware, mongoIdValidation('id'), validate, userController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user profile
 * @access  Protected (own profile or admin)
 */
router.put('/:id', authMiddleware, mongoIdValidation('id'), validate, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Admin
 */
router.delete('/:id', authMiddleware, adminMiddleware, mongoIdValidation('id'), validate, userController.deleteUser);

/**
 * @route   PUT /api/users/:id/ban
 * @desc    Ban/unban user
 * @access  Admin
 */
router.put('/:id/ban', authMiddleware, adminMiddleware, mongoIdValidation('id'), validate, userController.toggleBan);

/**
 * @route   PUT /api/users/:id/promote
 * @desc    Promote user to admin
 * @access  Admin
 */
router.put('/:id/promote', authMiddleware, adminMiddleware, mongoIdValidation('id'), validate, userController.promoteToAdmin);

export default router;
