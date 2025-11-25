"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationValidation = exports.mongoIdValidation = exports.createMessageValidation = exports.createMatchValidation = exports.createTripValidation = exports.loginValidation = exports.registerValidation = exports.validate = void 0;
const express_validator_1 = require("express-validator");
/**
 * Validate request and return errors if any
 */
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
exports.validate = validate;
/**
 * User registration validation rules
 */
exports.registerValidation = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[\d\s+\-()]+$/).withMessage('Invalid phone number format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('city')
        .trim()
        .notEmpty().withMessage('City is required'),
    (0, express_validator_1.body)('region')
        .trim()
        .notEmpty().withMessage('Region is required'),
    (0, express_validator_1.body)('favouriteTeam')
        .trim()
        .notEmpty().withMessage('Favourite team is required'),
    (0, express_validator_1.body)('supporterGroup')
        .trim()
        .notEmpty().withMessage('Supporter group is required'),
    (0, express_validator_1.body)('entryCenter')
        .trim()
        .notEmpty().withMessage('Entry center is required'),
    (0, express_validator_1.body)('isDriver')
        .optional()
        .isBoolean().withMessage('isDriver must be a boolean'),
    (0, express_validator_1.body)('maxSeats')
        .optional()
        .isInt({ min: 0, max: 10 }).withMessage('Max seats must be between 0 and 10'),
    (0, express_validator_1.body)('interests')
        .optional()
        .isArray().withMessage('Interests must be an array')
];
/**
 * User login validation rules
 */
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
];
/**
 * Trip creation validation rules
 */
exports.createTripValidation = [
    (0, express_validator_1.body)('match')
        .notEmpty().withMessage('Match is required')
        .isMongoId().withMessage('Invalid match ID'),
    (0, express_validator_1.body)('departureLocation')
        .trim()
        .notEmpty().withMessage('Departure location is required'),
    (0, express_validator_1.body)('departureTime')
        .notEmpty().withMessage('Departure time is required')
        .isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('availableSeats')
        .notEmpty().withMessage('Available seats is required')
        .isInt({ min: 1, max: 10 }).withMessage('Available seats must be between 1 and 10'),
    (0, express_validator_1.body)('vehicleInfo.make')
        .optional()
        .trim(),
    (0, express_validator_1.body)('vehicleInfo.model')
        .optional()
        .trim(),
    (0, express_validator_1.body)('vehicleInfo.color')
        .optional()
        .trim(),
    (0, express_validator_1.body)('vehicleInfo.plateNumber')
        .optional()
        .trim(),
    (0, express_validator_1.body)('preferences.smoking')
        .optional()
        .isBoolean().withMessage('Smoking preference must be a boolean'),
    (0, express_validator_1.body)('preferences.music')
        .optional()
        .isBoolean().withMessage('Music preference must be a boolean'),
    (0, express_validator_1.body)('preferences.conversation')
        .optional()
        .isBoolean().withMessage('Conversation preference must be a boolean')
];
/**
 * Match creation validation rules
 */
exports.createMatchValidation = [
    (0, express_validator_1.body)('homeTeam')
        .trim()
        .notEmpty().withMessage('Home team is required'),
    (0, express_validator_1.body)('awayTeam')
        .trim()
        .notEmpty().withMessage('Away team is required'),
    (0, express_validator_1.body)('stadium')
        .trim()
        .notEmpty().withMessage('Stadium is required'),
    (0, express_validator_1.body)('matchDate')
        .notEmpty().withMessage('Match date is required')
        .isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('competition')
        .trim()
        .notEmpty().withMessage('Competition is required'),
    (0, express_validator_1.body)('entryCenter')
        .trim()
        .notEmpty().withMessage('Entry center is required')
];
/**
 * Message creation validation rules
 */
exports.createMessageValidation = [
    (0, express_validator_1.body)('tripId')
        .notEmpty().withMessage('Trip ID is required')
        .isMongoId().withMessage('Invalid trip ID'),
    (0, express_validator_1.body)('content')
        .trim()
        .notEmpty().withMessage('Message content is required')
        .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters')
];
/**
 * MongoDB ObjectId validation
 */
const mongoIdValidation = (paramName) => [
    (0, express_validator_1.param)(paramName)
        .notEmpty().withMessage(`${paramName} is required`)
        .isMongoId().withMessage(`Invalid ${paramName}`)
];
exports.mongoIdValidation = mongoIdValidation;
/**
 * Pagination query validation
 */
exports.paginationValidation = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
