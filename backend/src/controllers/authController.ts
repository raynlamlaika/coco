import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { asyncHandler } from '../middleware/errorMiddleware';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token }
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, token }
  });
});

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // User is attached by authMiddleware
  const user = req.user;

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { user }
  });
});

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  // Since we use JWT, logout is handled client-side
  // This endpoint is for any server-side cleanup if needed
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});
