import api from './api';
import type { ApiResponse, Match, PaginatedResponse, MatchStats } from '../types';

interface MatchFilters {
  homeTeam?: string;
  awayTeam?: string;
  competition?: string;
  isUpcoming?: boolean;
  page?: number;
  limit?: number;
}

interface CreateMatchData {
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: string;
  competition: string;
  entryCenter: string;
}

/**
 * Get all matches with filtering
 */
export const getMatches = async (filters: MatchFilters = {}): Promise<PaginatedResponse<Match>> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });
  
  const response = await api.get<ApiResponse<PaginatedResponse<Match>>>(`/matches?${params.toString()}`);
  return response.data.data!;
};

/**
 * Get upcoming matches
 */
export const getUpcomingMatches = async (limit?: number): Promise<Match[]> => {
  const params = limit ? `?limit=${limit}` : '';
  const response = await api.get<ApiResponse<{ matches: Match[] }>>(`/matches/upcoming${params}`);
  return response.data.data!.matches;
};

/**
 * Get match by ID
 */
export const getMatchById = async (id: string): Promise<Match> => {
  const response = await api.get<ApiResponse<{ match: Match }>>(`/matches/${id}`);
  return response.data.data!.match;
};

/**
 * Create a new match (admin)
 */
export const createMatch = async (data: CreateMatchData): Promise<Match> => {
  const response = await api.post<ApiResponse<{ match: Match }>>('/matches', data);
  return response.data.data!.match;
};

/**
 * Update a match (admin)
 */
export const updateMatch = async (id: string, data: Partial<CreateMatchData>): Promise<Match> => {
  const response = await api.put<ApiResponse<{ match: Match }>>(`/matches/${id}`, data);
  return response.data.data!.match;
};

/**
 * Delete a match (admin)
 */
export const deleteMatch = async (id: string): Promise<void> => {
  await api.delete(`/matches/${id}`);
};

/**
 * Get match statistics (admin)
 */
export const getMatchStats = async (): Promise<MatchStats> => {
  const response = await api.get<ApiResponse<{ stats: MatchStats }>>('/matches/stats');
  return response.data.data!.stats;
};
