import User, { IUser } from '../models/User';
import { generateToken } from '../utils/jwt';

/**
 * User registration data interface
 */
interface RegisterData {
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
  profilePicture?: string;
}

/**
 * Login credentials interface
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Auth response interface
 */
interface AuthResponse {
  user: Partial<IUser>;
  token: string;
}

/**
 * Register a new user
 * @param data - User registration data
 * @returns User and token
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: data.email.toLowerCase() });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const user = new User({
    ...data,
    email: data.email.toLowerCase(),
    role: 'user',
    isBanned: false
  });

  await user.save();

  // Generate token
  const token = generateToken(user._id, user.email, user.role);

  // Return user without password
  const userResponse = user.toObject();
  delete (userResponse as { password?: string }).password;

  return { user: userResponse, token };
};

/**
 * Login user
 * @param credentials - Login credentials
 * @returns User and token
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Find user by email and explicitly select password field
  const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');
  
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if user is banned
  if (user.isBanned) {
    throw new Error('Your account has been banned');
  }

  // Verify password
  const isMatch = await user.comparePassword(credentials.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user._id, user.email, user.role);

  // Return user without password
  const userResponse = user.toObject();
  delete (userResponse as { password?: string }).password;

  return { user: userResponse, token };
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
 * Validate token and get user
 * @param userId - User ID from token
 * @returns User without password
 */
export const validateSession = async (userId: string): Promise<IUser | null> => {
  return getUserById(userId);
};
