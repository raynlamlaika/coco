import User, { IUser } from '../models/User';

/**
 * User update data interface
 */
interface UpdateUserData {
  fullName?: string;
  phone?: string;
  city?: string;
  region?: string;
  favouriteTeam?: string;
  supporterGroup?: string;
  entryCenter?: string;
  isDriver?: boolean;
  maxSeats?: number;
  interests?: string[];
  profilePicture?: string;
}

/**
 * Pagination options interface
 */
interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

/**
 * Paginated result interface
 */
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Get all users with pagination and filtering (admin)
 * @param options - Pagination and filter options
 * @returns Paginated user list
 */
export const getAllUsers = async (
  options: PaginationOptions
): Promise<PaginatedResult<IUser>> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query: Record<string, unknown> = {};
  
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
    User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(query)
  ]);

  return {
    data: users,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

/**
 * Get user by ID
 * @param userId - User ID
 * @returns User without password
 */
export const getUserById = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId).select('-password');
};

/**
 * Update user profile
 * @param userId - User ID
 * @param updateData - Data to update
 * @returns Updated user
 */
export const updateUser = async (
  userId: string,
  updateData: UpdateUserData
): Promise<IUser | null> => {
  // Prevent updating sensitive fields
  const allowedUpdates: UpdateUserData = {
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
    if (allowedUpdates[key as keyof UpdateUserData] === undefined) {
      delete allowedUpdates[key as keyof UpdateUserData];
    }
  });

  return User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  ).select('-password');
};

/**
 * Delete user (admin)
 * @param userId - User ID
 * @returns Deleted user
 */
export const deleteUser = async (userId: string): Promise<IUser | null> => {
  return User.findByIdAndDelete(userId).select('-password');
};

/**
 * Ban/unban user (admin)
 * @param userId - User ID
 * @param isBanned - Ban status
 * @returns Updated user
 */
export const setBanStatus = async (
  userId: string,
  isBanned: boolean
): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    userId,
    { isBanned },
    { new: true }
  ).select('-password');
};

/**
 * Promote user to admin (admin)
 * @param userId - User ID
 * @returns Updated user
 */
export const promoteToAdmin = async (userId: string): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    userId,
    { role: 'admin' },
    { new: true }
  ).select('-password');
};

/**
 * Get user statistics
 * @returns User statistics
 */
export const getUserStats = async (): Promise<{
  total: number;
  drivers: number;
  admins: number;
  banned: number;
}> => {
  const [total, drivers, admins, banned] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isDriver: true }),
    User.countDocuments({ role: 'admin' }),
    User.countDocuments({ isBanned: true })
  ]);

  return { total, drivers, admins, banned };
};
