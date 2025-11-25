import api from './api';
import type { ApiResponse, Trip, CreateTripData, UpdateTripData, PaginatedResponse, TripRecommendation, TripStats } from '../types';

interface TripFilters {
  match?: string;
  departureLocation?: string;
  status?: string;
  page?: number;
  limit?: number;
}

interface UserTrips {
  asDriver: Trip[];
  asPassenger: Trip[];
  requests: Trip[];
}

/**
 * Get all trips with filtering
 */
export const getTrips = async (filters: TripFilters = {}): Promise<PaginatedResponse<Trip>> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });
  
  const response = await api.get<ApiResponse<PaginatedResponse<Trip>>>(`/trips?${params.toString()}`);
  return response.data.data!;
};

/**
 * Get trip by ID
 */
export const getTripById = async (id: string): Promise<Trip> => {
  const response = await api.get<ApiResponse<{ trip: Trip }>>(`/trips/${id}`);
  return response.data.data!.trip;
};

/**
 * Create a new trip
 */
export const createTrip = async (data: CreateTripData): Promise<Trip> => {
  const response = await api.post<ApiResponse<{ trip: Trip }>>('/trips', data);
  return response.data.data!.trip;
};

/**
 * Update a trip
 */
export const updateTrip = async (id: string, data: UpdateTripData): Promise<Trip> => {
  const response = await api.put<ApiResponse<{ trip: Trip }>>(`/trips/${id}`, data);
  return response.data.data!.trip;
};

/**
 * Delete a trip
 */
export const deleteTrip = async (id: string): Promise<void> => {
  await api.delete(`/trips/${id}`);
};

/**
 * Request to join a trip
 */
export const requestToJoin = async (tripId: string): Promise<Trip> => {
  const response = await api.post<ApiResponse<{ trip: Trip }>>(`/trips/${tripId}/request`);
  return response.data.data!.trip;
};

/**
 * Confirm a passenger request
 */
export const confirmRequest = async (tripId: string, userId: string): Promise<Trip> => {
  const response = await api.post<ApiResponse<{ trip: Trip }>>(`/trips/${tripId}/confirm/${userId}`);
  return response.data.data!.trip;
};

/**
 * Reject a passenger request
 */
export const rejectRequest = async (tripId: string, userId: string): Promise<Trip> => {
  const response = await api.post<ApiResponse<{ trip: Trip }>>(`/trips/${tripId}/reject/${userId}`);
  return response.data.data!.trip;
};

/**
 * Get trip recommendations for grouping
 */
export const getTripRecommendations = async (tripId: string): Promise<TripRecommendation[]> => {
  const response = await api.get<ApiResponse<{ recommendations: TripRecommendation[] }>>(`/trips/${tripId}/recommendations`);
  return response.data.data!.recommendations;
};

/**
 * Get current user's trips
 */
export const getMyTrips = async (): Promise<UserTrips> => {
  const response = await api.get<ApiResponse<UserTrips>>('/trips/my-trips');
  return response.data.data!;
};

/**
 * Get trip recommendations for current user
 */
export const getTripsForUser = async (matchId?: string): Promise<TripRecommendation[]> => {
  const params = matchId ? `?matchId=${matchId}` : '';
  const response = await api.get<ApiResponse<{ recommendations: TripRecommendation[] }>>(`/trips/recommendations-for-user${params}`);
  return response.data.data!.recommendations;
};

/**
 * Group trips together
 */
export const groupTrips = async (tripIds: string[]): Promise<Trip[]> => {
  const response = await api.post<ApiResponse<{ trips: Trip[] }>>('/trips/group', { tripIds });
  return response.data.data!.trips;
};

/**
 * Get trip statistics (admin)
 */
export const getTripStats = async (): Promise<TripStats> => {
  const response = await api.get<ApiResponse<{ stats: TripStats }>>('/trips/stats');
  return response.data.data!.stats;
};
