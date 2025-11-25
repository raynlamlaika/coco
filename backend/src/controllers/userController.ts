import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { asyncHandler } from '../middleware/errorMiddleware';

/**
 * Get all users (admin only)
 * GET /api/users
 */
export const getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page, limit, search, role } = req.query;

  const result = await userService.getAllUsers({
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
    search: search as string,
    role: role as string
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  const user = await userService.getUserById(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
});

/**
 * Update user profile
 * PUT /api/users/:id
 */
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  
  // Check if user is updating their own profile or is admin
  if (req.user?._id.toString() !== id && req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'You can only update your own profile'
    });
    return;
  }

  const user = await userService.updateUser(id, req.body);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: { user }
  });
});

/**
 * Delete user (admin only)
 * DELETE /api/users/:id
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await userService.deleteUser(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

/**
 * Ban/unban user (admin only)
 * PUT /api/users/:id/ban
 */
export const toggleBan = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { isBanned } = req.body;

  if (typeof isBanned !== 'boolean') {
    res.status(400).json({
      success: false,
      message: 'isBanned must be a boolean'
    });
    return;
  }

  const user = await userService.setBanStatus(id, isBanned);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: isBanned ? 'User banned successfully' : 'User unbanned successfully',
    data: { user }
  });
});

/**
 * Promote user to admin (admin only)
 * PUT /api/users/:id/promote
 */
export const promoteToAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const user = await userService.promoteToAdmin(id);

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'User promoted to admin successfully',
    data: { user }
  });
});

/**
 * Get user statistics (admin only)
 * GET /api/users/stats
 */
export const getUserStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const stats = await userService.getUserStats();

  res.status(200).json({
    success: true,
    data: { stats }
  });
});
