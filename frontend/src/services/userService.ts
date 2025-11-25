import api from './api';
import { ApiResponse, User, PaginatedResponse, UserStats } from '../types';

interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}

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
 * Get all users with filtering (admin)
 */
export const getUsers = async (filters: UserFilters = {}): Promise<PaginatedResponse<User>> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });
  
  const response = await api.get<ApiResponse<PaginatedResponse<User>>>(`/users?${params.toString()}`);
  return response.data.data!;
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>(`/users/${id}`);
  return response.data.data!.user;
};

/**
 * Update user profile
 */
export const updateUser = async (id: string, data: UpdateUserData): Promise<User> => {
  const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}`, data);
  return response.data.data!.user;
};

/**
 * Delete user (admin)
 */
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

/**
 * Ban/unban user (admin)
 */
export const toggleBan = async (id: string, isBanned: boolean): Promise<User> => {
  const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}/ban`, { isBanned });
  return response.data.data!.user;
};

/**
 * Promote user to admin (admin)
 */
export const promoteToAdmin = async (id: string): Promise<User> => {
  const response = await api.put<ApiResponse<{ user: User }>>(`/users/${id}/promote`);
  return response.data.data!.user;
};

/**
 * Get user statistics (admin)
 */
export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get<ApiResponse<{ stats: UserStats }>>('/users/stats');
  return response.data.data!.stats;
};
