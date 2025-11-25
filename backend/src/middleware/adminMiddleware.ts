import { Request, Response, NextFunction } from 'express';

/**
 * Admin middleware
 * Checks if the authenticated user has admin role
 * Must be used after authMiddleware
 */
export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Check if user is attached to request (should be done by authMiddleware)
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
      return;
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authorization error.' 
    });
  }
};

/**
 * Driver middleware
 * Checks if the authenticated user is a driver
 * Must be used after authMiddleware
 */
export const driverMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required.' 
      });
      return;
    }

    if (!req.user.isDriver) {
      res.status(403).json({ 
        success: false, 
        message: 'Access denied. Driver privileges required.' 
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Driver middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Authorization error.' 
    });
  }
};
