import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractToken } from '../utils/jwt';
import User from '../models/User';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractToken(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token.' 
      });
      return;
    }

    // Find user and attach to request
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      res.status(401).json({ 
        success: false, 
        message: 'User not found.' 
      });
      return;
    }

    // Check if user is banned
    if (user.isBanned) {
      res.status(403).json({ 
        success: false, 
        message: 'Your account has been banned.' 
      });
      return;
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication error.' 
    });
  }
};

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't require it
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req.headers.authorization);
    
    if (token) {
      const decoded = verifyToken(token);
      
      if (decoded) {
        const user = await User.findById(decoded.userId).select('-password');
        if (user && !user.isBanned) {
          req.user = user;
        }
      }
    }
    
    next();
  } catch {
    // Continue without user
    next();
  }
};
