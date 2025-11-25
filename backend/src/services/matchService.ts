import Match, { IMatch } from '../models/Match';

/**
 * Match creation data interface
 */
interface CreateMatchData {
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: Date;
  competition: string;
  entryCenter: string;
  isUpcoming?: boolean;
}

/**
 * Match update data interface
 */
interface UpdateMatchData {
  homeTeam?: string;
  awayTeam?: string;
  stadium?: string;
  matchDate?: Date;
  competition?: string;
  entryCenter?: string;
  isUpcoming?: boolean;
}

/**
 * Match filter options interface
 */
interface MatchFilterOptions {
  homeTeam?: string;
  awayTeam?: string;
  competition?: string;
  isUpcoming?: boolean;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
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
 * Create a new match
 * @param data - Match creation data
 * @returns Created match
 */
export const createMatch = async (data: CreateMatchData): Promise<IMatch> => {
  const match = new Match({
    ...data,
    isUpcoming: data.isUpcoming ?? true
  });
  
  await match.save();
  return match;
};

/**
 * Get all matches with filtering and pagination
 * @param options - Filter options
 * @returns Paginated match list
 */
export const getAllMatches = async (
  options: MatchFilterOptions
): Promise<PaginatedResult<IMatch>> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query: Record<string, unknown> = {};

  if (options.homeTeam) {
    query.homeTeam = new RegExp(options.homeTeam, 'i');
  }

  if (options.awayTeam) {
    query.awayTeam = new RegExp(options.awayTeam, 'i');
  }

  if (options.competition) {
    query.competition = new RegExp(options.competition, 'i');
  }

  if (options.isUpcoming !== undefined) {
    query.isUpcoming = options.isUpcoming;
  }

  if (options.fromDate || options.toDate) {
    query.matchDate = {};
    if (options.fromDate) {
      (query.matchDate as Record<string, Date>).$gte = options.fromDate;
    }
    if (options.toDate) {
      (query.matchDate as Record<string, Date>).$lte = options.toDate;
    }
  }

  // Execute query
  const [matches, total] = await Promise.all([
    Match.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ matchDate: 1 }),
    Match.countDocuments(query)
  ]);

  return {
    data: matches,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

/**
 * Get match by ID
 * @param matchId - Match ID
 * @returns Match
 */
export const getMatchById = async (matchId: string): Promise<IMatch | null> => {
  return Match.findById(matchId);
};

/**
 * Update match
 * @param matchId - Match ID
 * @param updateData - Update data
 * @returns Updated match
 */
export const updateMatch = async (
  matchId: string,
  updateData: UpdateMatchData
): Promise<IMatch | null> => {
  return Match.findByIdAndUpdate(
    matchId,
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

/**
 * Delete match
 * @param matchId - Match ID
 * @returns Deleted match
 */
export const deleteMatch = async (matchId: string): Promise<IMatch | null> => {
  return Match.findByIdAndDelete(matchId);
};

/**
 * Get upcoming matches
 * @param limit - Maximum number of matches to return
 * @returns Array of upcoming matches
 */
export const getUpcomingMatches = async (limit: number = 10): Promise<IMatch[]> => {
  return Match.find({ 
    isUpcoming: true,
    matchDate: { $gte: new Date() }
  })
    .sort({ matchDate: 1 })
    .limit(limit);
};

/**
 * Mark past matches as not upcoming
 * This can be called by a scheduled job
 */
export const updatePastMatches = async (): Promise<number> => {
  const result = await Match.updateMany(
    { 
      matchDate: { $lt: new Date() },
      isUpcoming: true
    },
    { isUpcoming: false }
  );
  
  return result.modifiedCount;
};

/**
 * Get match statistics
 * @returns Match statistics
 */
export const getMatchStats = async (): Promise<{
  total: number;
  upcoming: number;
  past: number;
}> => {
  const [total, upcoming, past] = await Promise.all([
    Match.countDocuments(),
    Match.countDocuments({ isUpcoming: true }),
    Match.countDocuments({ isUpcoming: false })
  ]);

  return { total, upcoming, past };
};
