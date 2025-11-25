"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.notFoundHandler = exports.ApiError = void 0;
/**
 * Custom error class for API errors
 */
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Maintains proper stack trace for debugging
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
/**
 * Not found error handler
 * Catches requests to undefined routes
 */
const notFoundHandler = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
/**
 * Global error handler middleware
 * Handles all errors passed to next()
 */
const errorHandler = (err, req, res, _next) => {
    // Default error values
    let statusCode = 500;
    let message = 'Internal server error';
    let stack;
    // Handle known error types
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err.name === 'ValidationError') {
        // Mongoose validation error
        statusCode = 400;
        message = err.message;
    }
    else if (err.name === 'CastError') {
        // Mongoose cast error (invalid ObjectId)
        statusCode = 400;
        message = 'Invalid ID format';
    }
    else if (err.code === 'ENOENT') {
        statusCode = 404;
        message = 'Resource not found';
    }
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    else if (err.code === 11000) {
        // MongoDB duplicate key error
        statusCode = 400;
        message = 'Duplicate field value';
    }
    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        stack = err.stack;
        console.error('Error:', err);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(stack && { stack })
    });
};
exports.errorHandler = errorHandler;
/**
 * Async handler wrapper
 * Wraps async functions to automatically catch errors
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
