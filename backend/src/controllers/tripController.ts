import { Request, Response } from 'express';
import * as tripService from '../services/tripService';
import * as recommendationService from '../services/recommendationService';
import { asyncHandler } from '../middleware/errorMiddleware';

/**
 * Create a new trip
 * POST /api/trips
 */
export const createTrip = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const tripData = {
    ...req.body,
    driver: req.user?._id
  };

  const trip = await tripService.createTrip(tripData);

  res.status(201).json({
    success: true,
    message: 'Trip created successfully',
    data: { trip }
  });
});

/**
 * Get all trips with filtering
 * GET /api/trips
 */
export const getAllTrips = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { match, departureLocation, status, driver, passenger, fromDate, toDate, page, limit } = req.query;

  const result = await tripService.getAllTrips({
    match: match as string,
    departureLocation: departureLocation as string,
    status: status as string,
    driver: driver as string,
    passenger: passenger as string,
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
 * Get trip by ID
 * GET /api/trips/:id
 */
export const getTripById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const trip = await tripService.getTripById(id);

  if (!trip) {
    res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { trip }
  });
});

/**
 * Update trip
 * PUT /api/trips/:id
 */
export const updateTrip = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const trip = await tripService.updateTrip(id, req.user!._id.toString(), req.body);

  if (!trip) {
    res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'Trip updated successfully',
    data: { trip }
  });
});

/**
 * Delete trip
 * DELETE /api/trips/:id
 */
export const deleteTrip = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await tripService.deleteTrip(id, req.user!._id.toString());

  res.status(200).json({
    success: true,
    message: 'Trip deleted successfully'
  });
});

/**
 * Request to join a trip
 * POST /api/trips/:id/request
 */
export const requestToJoin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const trip = await tripService.requestToJoin(id, req.user!._id.toString());

  res.status(200).json({
    success: true,
    message: 'Request sent successfully',
    data: { trip }
  });
});

/**
 * Confirm a passenger request
 * POST /api/trips/:id/confirm/:userId
 */
export const confirmRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id, userId } = req.params;

  const trip = await tripService.confirmRequest(id, req.user!._id.toString(), userId);

  res.status(200).json({
    success: true,
    message: 'Request confirmed successfully',
    data: { trip }
  });
});

/**
 * Reject a passenger request
 * POST /api/trips/:id/reject/:userId
 */
export const rejectRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id, userId } = req.params;

  const trip = await tripService.rejectRequest(id, req.user!._id.toString(), userId);

  res.status(200).json({
    success: true,
    message: 'Request rejected successfully',
    data: { trip }
  });
});

/**
 * Get trip recommendations for grouping
 * GET /api/trips/:id/recommendations
 */
export const getRecommendations = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const recommendations = await recommendationService.getRecommendations(id);

  res.status(200).json({
    success: true,
    data: { recommendations }
  });
});

/**
 * Group trips together
 * POST /api/trips/group
 */
export const groupTrips = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { tripIds } = req.body;

  if (!Array.isArray(tripIds) || tripIds.length < 2) {
    res.status(400).json({
      success: false,
      message: 'At least 2 trip IDs are required'
    });
    return;
  }

  const trips = await tripService.groupTrips(tripIds);

  res.status(200).json({
    success: true,
    message: 'Trips grouped successfully',
    data: { trips }
  });
});

/**
 * Get user's trips (as driver and passenger)
 * GET /api/trips/my-trips
 */
export const getMyTrips = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const trips = await tripService.getUserTrips(req.user!._id.toString());

  res.status(200).json({
    success: true,
    data: trips
  });
});

/**
 * Find best trips for user
 * GET /api/trips/recommendations-for-user
 */
export const getTripsForUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { matchId } = req.query;

  const recommendations = await recommendationService.findBestTripsForUser(
    req.user!._id.toString(),
    matchId as string
  );

  res.status(200).json({
    success: true,
    data: { recommendations }
  });
});

/**
 * Get trip statistics (admin only)
 * GET /api/trips/stats
 */
export const getTripStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const stats = await tripService.getTripStats();

  res.status(200).json({
    success: true,
    data: { stats }
  });
});
