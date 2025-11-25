"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generate a JWT token for the user
 * @param userId - User's MongoDB ObjectId
 * @param email - User's email
 * @param role - User's role (user/admin)
 * @returns JWT token string
 */
const generateToken = (userId, email, role) => {
    const secret = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';
    const payload = {
        userId: userId.toString(),
        email,
        role
    };
    const options = { expiresIn: '24h' };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'default_jwt_secret_change_in_production';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch {
        return null;
    }
};
exports.verifyToken = verifyToken;
/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header string
 * @returns Token string or null
 */
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
};
exports.extractToken = extractToken;
