import { body, param, query, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validate request and return errors if any
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      success: false, 
      message: 'Validation failed',
      errors: errors.array() 
    });
    return;
  }
  next();
};

/**
 * User registration validation rules
 */
export const registerValidation: ValidationChain[] = [
  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s+\-()]+$/).withMessage('Invalid phone number format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('city')
    .trim()
    .notEmpty().withMessage('City is required'),
  body('region')
    .trim()
    .notEmpty().withMessage('Region is required'),
  body('favouriteTeam')
    .trim()
    .notEmpty().withMessage('Favourite team is required'),
  body('supporterGroup')
    .trim()
    .notEmpty().withMessage('Supporter group is required'),
  body('entryCenter')
    .trim()
    .notEmpty().withMessage('Entry center is required'),
  body('isDriver')
    .optional()
    .isBoolean().withMessage('isDriver must be a boolean'),
  body('maxSeats')
    .optional()
    .isInt({ min: 0, max: 10 }).withMessage('Max seats must be between 0 and 10'),
  body('interests')
    .optional()
    .isArray().withMessage('Interests must be an array')
];

/**
 * User login validation rules
 */
export const loginValidation: ValidationChain[] = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Trip creation validation rules
 */
export const createTripValidation: ValidationChain[] = [
  body('match')
    .notEmpty().withMessage('Match is required')
    .isMongoId().withMessage('Invalid match ID'),
  body('departureLocation')
    .trim()
    .notEmpty().withMessage('Departure location is required'),
  body('departureTime')
    .notEmpty().withMessage('Departure time is required')
    .isISO8601().withMessage('Invalid date format'),
  body('availableSeats')
    .notEmpty().withMessage('Available seats is required')
    .isInt({ min: 1, max: 10 }).withMessage('Available seats must be between 1 and 10'),
  body('vehicleInfo.make')
    .optional()
    .trim(),
  body('vehicleInfo.model')
    .optional()
    .trim(),
  body('vehicleInfo.color')
    .optional()
    .trim(),
  body('vehicleInfo.plateNumber')
    .optional()
    .trim(),
  body('preferences.smoking')
    .optional()
    .isBoolean().withMessage('Smoking preference must be a boolean'),
  body('preferences.music')
    .optional()
    .isBoolean().withMessage('Music preference must be a boolean'),
  body('preferences.conversation')
    .optional()
    .isBoolean().withMessage('Conversation preference must be a boolean')
];

/**
 * Match creation validation rules
 */
export const createMatchValidation: ValidationChain[] = [
  body('homeTeam')
    .trim()
    .notEmpty().withMessage('Home team is required'),
  body('awayTeam')
    .trim()
    .notEmpty().withMessage('Away team is required'),
  body('stadium')
    .trim()
    .notEmpty().withMessage('Stadium is required'),
  body('matchDate')
    .notEmpty().withMessage('Match date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('competition')
    .trim()
    .notEmpty().withMessage('Competition is required'),
  body('entryCenter')
    .trim()
    .notEmpty().withMessage('Entry center is required')
];

/**
 * Message creation validation rules
 */
export const createMessageValidation: ValidationChain[] = [
  body('tripId')
    .notEmpty().withMessage('Trip ID is required')
    .isMongoId().withMessage('Invalid trip ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required')
    .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];

/**
 * MongoDB ObjectId validation
 */
export const mongoIdValidation = (paramName: string): ValidationChain[] => [
  param(paramName)
    .notEmpty().withMessage(`${paramName} is required`)
    .isMongoId().withMessage(`Invalid ${paramName}`)
];

/**
 * Pagination query validation
 */
export const paginationValidation: ValidationChain[] = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
