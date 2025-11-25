"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSession = exports.getUserById = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
/**
 * Register a new user
 * @param data - User registration data
 * @returns User and token
 */
const register = async (data) => {
    // Check if user already exists
    const existingUser = await User_1.default.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    // Create new user
    const user = new User_1.default({
        ...data,
        email: data.email.toLowerCase(),
        role: 'user',
        isBanned: false
    });
    await user.save();
    // Generate token
    const token = (0, jwt_1.generateToken)(user._id, user.email, user.role);
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    return { user: userResponse, token };
};
exports.register = register;
/**
 * Login user
 * @param credentials - Login credentials
 * @returns User and token
 */
const login = async (credentials) => {
    // Find user by email
    const user = await User_1.default.findOne({ email: credentials.email.toLowerCase() });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    // Check if user is banned
    if (user.isBanned) {
        throw new Error('Your account has been banned');
    }
    // Verify password
    const isMatch = await user.comparePassword(credentials.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    // Generate token
    const token = (0, jwt_1.generateToken)(user._id, user.email, user.role);
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    return { user: userResponse, token };
};
exports.login = login;
/**
 * Get user by ID
 * @param userId - User ID
 * @returns User without password
 */
const getUserById = async (userId) => {
    return User_1.default.findById(userId).select('-password');
};
exports.getUserById = getUserById;
/**
 * Validate token and get user
 * @param userId - User ID from token
 * @returns User without password
 */
const validateSession = async (userId) => {
    return (0, exports.getUserById)(userId);
};
exports.validateSession = validateSession;
