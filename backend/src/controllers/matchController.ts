import { Request, Response } from 'express';
import * as matchService from '../services/matchService';
import { asyncHandler } from '../middleware/errorMiddleware';

/**
 * Create a new match (admin only)
 * POST /api/matches
 */
export const createMatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const match = await matchService.createMatch(req.body);

  res.status(201).json({
    success: true,
    message: 'Match created successfully',
    data: { match }
  });
});

/**
 * Get all matches with filtering
 * GET /api/matches
 */
export const getAllMatches = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { homeTeam, awayTeam, competition, isUpcoming, fromDate, toDate, page, limit } = req.query;

  const result = await matchService.getAllMatches({
    homeTeam: homeTeam as string,
    awayTeam: awayTeam as string,
    competition: competition as string,
    isUpcoming: isUpcoming === 'true' ? true : isUpcoming === 'false' ? false : undefined,
    fromDate: fromDate ? new Date(fromDate as string) : undefined,
    toDate: toDate ? new Date(toDate as string) : undefined,
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined
  });

  res.status(200).json({
    success: true,
    data: result
  });
});

/**
 * Get match by ID
 * GET /api/matches/:id
 */
export const getMatchById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const match = await matchService.getMatchById(id);

  if (!match) {
    res.status(404).json({
      success: false,
      message: 'Match not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { match }
  });
});

/**
 * Update match (admin only)
 * PUT /api/matches/:id
 */
export const updateMatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const match = await matchService.updateMatch(id, req.body);

  if (!match) {
    res.status(404).json({
      success: false,
      message: 'Match not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Match updated successfully',
    data: { match }
  });
});

/**
 * Delete match (admin only)
 * DELETE /api/matches/:id
 */
export const deleteMatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const match = await matchService.deleteMatch(id);

  if (!match) {
    res.status(404).json({
      success: false,
      message: 'Match not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Match deleted successfully'
  });
});

/**
 * Get upcoming matches
 * GET /api/matches/upcoming
 */
export const getUpcomingMatches = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { limit } = req.query;

  const matches = await matchService.getUpcomingMatches(
    limit ? parseInt(limit as string) : undefined
  );

  res.status(200).json({
    success: true,
    data: { matches }
  });
});

/**
 * Get match statistics (admin only)
 * GET /api/matches/stats
 */
export const getMatchStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const stats = await matchService.getMatchStats();

  res.status(200).json({
    success: true,
    data: { stats }
  });
});
