import api from './api';
import type { ApiResponse, AuthResponse, LoginData, RegisterData, User } from '../types';

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
  return response.data.data!;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return response.data.data!;
};

/**
 * Get current authenticated user
 */
export const getMe = async (): Promise<User> => {
  const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
  return response.data.data!.user;
};

/**
 * Logout user (client-side)
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
