import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { Types } from 'mongoose';

// JWT payload interface
interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate a JWT token for the user
 * @param userId - User's MongoDB ObjectId
 * @param email - User's email
 * @param role - User's role (user/admin)
 * @returns JWT token string
 */
export const generateToken = (
  userId: Types.ObjectId | string, 
  email: string, 
  role: string
): string => {
  const secret: Secret = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';
  
  const payload: JwtPayload = {
    userId: userId.toString(),
    email,
    role
  };

  const options: SignOptions = { expiresIn: '24h' };
  return jwt.sign(payload, secret, options);
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header string
 * @returns Token string or null
 */
export const extractToken = (authHeader?: string): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};
