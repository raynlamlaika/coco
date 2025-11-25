import { IUser } from '../models/User';

/**
 * Extend Express Request to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
