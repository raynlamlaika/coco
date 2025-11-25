import Trip, { ITrip } from '../models/Trip';
import User from '../models/User';
import { Types } from 'mongoose';

/**
 * Trip creation data interface
 */
interface CreateTripData {
  driver: Types.ObjectId | string;
  match: Types.ObjectId | string;
  departureLocation: string;
  departureTime: Date;
  availableSeats: number;
  vehicleInfo?: {
    make?: string;
    model?: string;
    color?: string;
    plateNumber?: string;
  };
  preferences?: {
    smoking?: boolean;
    music?: boolean;
    conversation?: boolean;
  };
}

/**
 * Trip update data interface
 */
interface UpdateTripData {
  departureLocation?: string;
  departureTime?: Date;
  availableSeats?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  vehicleInfo?: {
    make?: string;
    model?: string;
    color?: string;
    plateNumber?: string;
  };
  preferences?: {
    smoking?: boolean;
    music?: boolean;
    conversation?: boolean;
  };
}

/**
 * Trip filter options interface
 */
interface TripFilterOptions {
  match?: string;
  departureLocation?: string;
  status?: string;
  driver?: string;
  passenger?: string;
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
 * Create a new trip
 * @param data - Trip creation data
 * @returns Created trip
 */
export const createTrip = async (data: CreateTripData): Promise<ITrip> => {
  // Verify driver exists and is actually a driver
  const driver = await User.findById(data.driver);
  if (!driver) {
    throw new Error('Driver not found');
  }
  if (!driver.isDriver) {
    throw new Error('User is not registered as a driver');
  }

  const trip = new Trip(data);
  await trip.save();
  
  return trip.populate([
    { path: 'driver', select: '-password' },
    { path: 'match' }
  ]);
};

/**
 * Get all trips with filtering and pagination
 * @param options - Filter options
 * @returns Paginated trip list
 */
export const getAllTrips = async (
  options: TripFilterOptions
): Promise<PaginatedResult<ITrip>> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  // Build query
  const query: Record<string, unknown> = {};

  if (options.match) {
    query.match = new Types.ObjectId(options.match);
  }

  if (options.departureLocation) {
    query.departureLocation = new RegExp(options.departureLocation, 'i');
  }

  if (options.status) {
    query.status = options.status;
  }

  if (options.driver) {
    query.driver = new Types.ObjectId(options.driver);
  }

  if (options.passenger) {
    query.passengers = new Types.ObjectId(options.passenger);
  }

  if (options.fromDate || options.toDate) {
    query.departureTime = {};
    if (options.fromDate) {
      (query.departureTime as Record<string, Date>).$gte = options.fromDate;
    }
    if (options.toDate) {
      (query.departureTime as Record<string, Date>).$lte = options.toDate;
    }
  }

  // Execute query
  const [trips, total] = await Promise.all([
    Trip.find(query)
      .populate('driver', '-password')
      .populate('match')
      .populate('passengers', '-password')
      .skip(skip)
      .limit(limit)
      .sort({ departureTime: 1 }),
    Trip.countDocuments(query)
  ]);

  return {
    data: trips,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

/**
 * Get trip by ID
 * @param tripId - Trip ID
 * @returns Trip with populated references
 */
export const getTripById = async (tripId: string): Promise<ITrip | null> => {
  return Trip.findById(tripId)
    .populate('driver', '-password')
    .populate('match')
    .populate('passengers', '-password')
    .populate('requests.user', '-password')
    .populate('groupedWith');
};

/**
 * Update trip
 * @param tripId - Trip ID
 * @param userId - User ID (must be driver)
 * @param updateData - Update data
 * @returns Updated trip
 */
export const updateTrip = async (
  tripId: string,
  userId: string,
  updateData: UpdateTripData
): Promise<ITrip | null> => {
  const trip = await Trip.findById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check if user is the driver
  if (trip.driver.toString() !== userId) {
    throw new Error('Only the driver can update this trip');
  }

  // Update trip
  Object.assign(trip, updateData);
  await trip.save();

  return trip.populate([
    { path: 'driver', select: '-password' },
    { path: 'match' },
    { path: 'passengers', select: '-password' }
  ]);
};

/**
 * Delete trip
 * @param tripId - Trip ID
 * @param userId - User ID (must be driver)
 * @returns Deleted trip
 */
export const deleteTrip = async (
  tripId: string,
  userId: string
): Promise<ITrip | null> => {
  const trip = await Trip.findById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check if user is the driver
  if (trip.driver.toString() !== userId) {
    throw new Error('Only the driver can delete this trip');
  }

  return Trip.findByIdAndDelete(tripId);
};

/**
 * Request to join a trip
 * @param tripId - Trip ID
 * @param userId - User ID
 * @returns Updated trip
 */
export const requestToJoin = async (
  tripId: string,
  userId: string
): Promise<ITrip> => {
  const trip = await Trip.findById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check if trip has available seats
  if (trip.availableSeats <= 0) {
    throw new Error('No available seats');
  }

  // Check if user is the driver
  if (trip.driver.toString() === userId) {
    throw new Error('Driver cannot request to join their own trip');
  }

  // Check if user already requested
  const existingRequest = trip.requests.find(
    r => r.user.toString() === userId
  );
  if (existingRequest) {
    throw new Error('You have already requested to join this trip');
  }

  // Check if user is already a passenger
  if (trip.passengers.some(p => p.toString() === userId)) {
    throw new Error('You are already a passenger on this trip');
  }

  // Add request
  trip.requests.push({
    user: new Types.ObjectId(userId),
    status: 'pending',
    requestedAt: new Date()
  });

  await trip.save();

  return trip.populate([
    { path: 'driver', select: '-password' },
    { path: 'match' },
    { path: 'requests.user', select: '-password' }
  ]);
};

/**
 * Confirm a passenger request
 * @param tripId - Trip ID
 * @param driverId - Driver user ID
 * @param passengerId - Passenger user ID
 * @returns Updated trip
 */
export const confirmRequest = async (
  tripId: string,
  driverId: string,
  passengerId: string
): Promise<ITrip> => {
  const trip = await Trip.findById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check if user is the driver
  if (trip.driver.toString() !== driverId) {
    throw new Error('Only the driver can confirm requests');
  }

  // Use the model method
  await trip.confirmRequest(new Types.ObjectId(passengerId));

  return trip.populate([
    { path: 'driver', select: '-password' },
    { path: 'match' },
    { path: 'passengers', select: '-password' },
    { path: 'requests.user', select: '-password' }
  ]);
};

/**
 * Reject a passenger request
 * @param tripId - Trip ID
 * @param driverId - Driver user ID
 * @param passengerId - Passenger user ID
 * @returns Updated trip
 */
export const rejectRequest = async (
  tripId: string,
  driverId: string,
  passengerId: string
): Promise<ITrip> => {
  const trip = await Trip.findById(tripId);
  
  if (!trip) {
    throw new Error('Trip not found');
  }

  // Check if user is the driver
  if (trip.driver.toString() !== driverId) {
    throw new Error('Only the driver can reject requests');
  }

  // Use the model method
  await trip.rejectRequest(new Types.ObjectId(passengerId));

  return trip.populate([
    { path: 'driver', select: '-password' },
    { path: 'match' },
    { path: 'requests.user', select: '-password' }
  ]);
};

/**
 * Group trips together
 * @param tripIds - Array of trip IDs to group
 * @returns Updated trips
 */
export const groupTrips = async (tripIds: string[]): Promise<ITrip[]> => {
  if (tripIds.length < 2) {
    throw new Error('At least 2 trips required for grouping');
  }

  const trips = await Trip.find({ _id: { $in: tripIds } });

  if (trips.length !== tripIds.length) {
    throw new Error('Some trips not found');
  }

  // Update each trip with grouping info
  for (const trip of trips) {
    trip.isGrouped = true;
    trip.groupedWith = tripIds
      .filter(id => id !== trip._id.toString())
      .map(id => new Types.ObjectId(id));
    await trip.save();
  }

  return Trip.find({ _id: { $in: tripIds } })
    .populate('driver', '-password')
    .populate('match')
    .populate('groupedWith');
};

/**
 * Get trips by user (as driver or passenger)
 * @param userId - User ID
 * @returns Object with trips as driver and passenger
 */
export const getUserTrips = async (userId: string): Promise<{
  asDriver: ITrip[];
  asPassenger: ITrip[];
  requests: ITrip[];
}> => {
  const [asDriver, asPassenger, requests] = await Promise.all([
    Trip.find({ driver: userId })
      .populate('driver', '-password')
      .populate('match')
      .populate('passengers', '-password')
      .populate('requests.user', '-password')
      .sort({ departureTime: 1 }),
    Trip.find({ passengers: userId })
      .populate('driver', '-password')
      .populate('match')
      .sort({ departureTime: 1 }),
    Trip.find({ 'requests.user': userId, 'requests.status': 'pending' })
      .populate('driver', '-password')
      .populate('match')
      .sort({ departureTime: 1 })
  ]);

  return { asDriver, asPassenger, requests };
};

/**
 * Get trip statistics
 * @returns Trip statistics
 */
export const getTripStats = async (): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}> => {
  const [total, pending, confirmed, completed, cancelled] = await Promise.all([
    Trip.countDocuments(),
    Trip.countDocuments({ status: 'pending' }),
    Trip.countDocuments({ status: 'confirmed' }),
    Trip.countDocuments({ status: 'completed' }),
    Trip.countDocuments({ status: 'cancelled' })
  ]);

  return { total, pending, confirmed, completed, cancelled };
};
