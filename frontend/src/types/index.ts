/**
 * User type definition
 */
export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  region: string;
  favouriteTeam: string;
  supporterGroup: string;
  isDriver: boolean;
  maxSeats: number;
  entryCenter: string;
  interests: string[];
  profilePicture: string;
  role: 'user' | 'admin';
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Match type definition
 */
export interface Match {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: string;
  competition: string;
  entryCenter: string;
  isUpcoming: boolean;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Passenger request type
 */
export interface PassengerRequest {
  user: User | string;
  status: 'pending' | 'confirmed' | 'rejected';
  requestedAt: string;
}

/**
 * Vehicle info type
 */
export interface VehicleInfo {
  make: string;
  model: string;
  color: string;
  plateNumber: string;
}

/**
 * Trip preferences type
 */
export interface TripPreferences {
  smoking: boolean;
  music: boolean;
  conversation: boolean;
}

/**
 * Trip type definition
 */
export interface Trip {
  _id: string;
  driver: User;
  match: Match;
  departureLocation: string;
  departureTime: string;
  availableSeats: number;
  passengers: User[];
  requests: PassengerRequest[];
  messages: string[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  vehicleInfo: VehicleInfo;
  preferences: TripPreferences;
  groupingScore: number;
  isGrouped: boolean;
  groupedWith: Trip[];
  confirmedPassengers?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Message type definition
 */
export interface Message {
  _id: string;
  trip: string;
  sender: User;
  content: string;
  timestamp: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API response type
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; path: string }>;
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Auth response type
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Registration data type
 */
export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  region: string;
  favouriteTeam: string;
  supporterGroup: string;
  entryCenter: string;
  isDriver?: boolean;
  maxSeats?: number;
  interests?: string[];
}

/**
 * Login data type
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Trip creation data
 */
export interface CreateTripData {
  match: string;
  departureLocation: string;
  departureTime: string;
  availableSeats: number;
  vehicleInfo?: Partial<VehicleInfo>;
  preferences?: Partial<TripPreferences>;
}

/**
 * Trip recommendation type
 */
export interface TripRecommendation {
  trip: Trip;
  score: number;
  matchedCriteria: string[];
}

/**
 * Stats types
 */
export interface UserStats {
  total: number;
  drivers: number;
  admins: number;
  banned: number;
}

export interface TripStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface MatchStats {
  total: number;
  upcoming: number;
  past: number;
}
