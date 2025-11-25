"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserStats = exports.promoteToAdmin = exports.setBanStatus = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
/**
 * Get all users with pagination and filtering (admin)
 * @param options - Pagination and filter options
 * @returns Paginated user list
 */
const getAllUsers = async (options) => {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    // Build query
    const query = {};
    if (options.search) {
        const searchRegex = new RegExp(options.search, 'i');
        query.$or = [
            { fullName: searchRegex },
            { email: searchRegex },
            { city: searchRegex }
        ];
    }
    if (options.role) {
        query.role = options.role;
    }
    // Execute query with pagination
    const [users, total] = await Promise.all([
        User_1.default.find(query)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        User_1.default.countDocuments(query)
    ]);
    return {
        data: users,
        total,
        page,
        pages: Math.ceil(total / limit)
    };
};
exports.getAllUsers = getAllUsers;
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
 * Update user profile
 * @param userId - User ID
 * @param updateData - Data to update
 * @returns Updated user
 */
const updateUser = async (userId, updateData) => {
    // Prevent updating sensitive fields
    const allowedUpdates = {
        fullName: updateData.fullName,
        phone: updateData.phone,
        city: updateData.city,
        region: updateData.region,
        favouriteTeam: updateData.favouriteTeam,
        supporterGroup: updateData.supporterGroup,
        entryCenter: updateData.entryCenter,
        isDriver: updateData.isDriver,
        maxSeats: updateData.maxSeats,
        interests: updateData.interests,
        profilePicture: updateData.profilePicture
    };
    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => {
        if (allowedUpdates[key] === undefined) {
            delete allowedUpdates[key];
        }
    });
    return User_1.default.findByIdAndUpdate(userId, { $set: allowedUpdates }, { new: true, runValidators: true }).select('-password');
};
exports.updateUser = updateUser;
/**
 * Delete user (admin)
 * @param userId - User ID
 * @returns Deleted user
 */
const deleteUser = async (userId) => {
    return User_1.default.findByIdAndDelete(userId).select('-password');
};
exports.deleteUser = deleteUser;
/**
 * Ban/unban user (admin)
 * @param userId - User ID
 * @param isBanned - Ban status
 * @returns Updated user
 */
const setBanStatus = async (userId, isBanned) => {
    return User_1.default.findByIdAndUpdate(userId, { isBanned }, { new: true }).select('-password');
};
exports.setBanStatus = setBanStatus;
/**
 * Promote user to admin (admin)
 * @param userId - User ID
 * @returns Updated user
 */
const promoteToAdmin = async (userId) => {
    return User_1.default.findByIdAndUpdate(userId, { role: 'admin' }, { new: true }).select('-password');
};
exports.promoteToAdmin = promoteToAdmin;
/**
 * Get user statistics
 * @returns User statistics
 */
const getUserStats = async () => {
    const [total, drivers, admins, banned] = await Promise.all([
        User_1.default.countDocuments(),
        User_1.default.countDocuments({ isDriver: true }),
        User_1.default.countDocuments({ role: 'admin' }),
        User_1.default.countDocuments({ isBanned: true })
    ]);
    return { total, drivers, admins, banned };
};
exports.getUserStats = getUserStats;
