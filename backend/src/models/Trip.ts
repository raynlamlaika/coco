import mongoose, { Document, Model, Schema, Types } from 'mongoose';

/**
 * Interface for passenger request
 */
export interface IPassengerRequest {
  user: Types.ObjectId;
  status: 'pending' | 'confirmed' | 'rejected';
  requestedAt: Date;
}

/**
 * Interface for vehicle information
 */
export interface IVehicleInfo {
  make: string;
  model: string;
  color: string;
  plateNumber: string;
}

/**
 * Interface for trip preferences
 */
export interface ITripPreferences {
  smoking: boolean;
  music: boolean;
  conversation: boolean;
}

/**
 * Interface for Trip document
 */
export interface ITrip extends Document {
  driver: Types.ObjectId;
  match: Types.ObjectId;
  departureLocation: string;
  departureTime: Date;
  availableSeats: number;
  passengers: Types.ObjectId[];
  requests: IPassengerRequest[];
  messages: Types.ObjectId[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  vehicleInfo: IVehicleInfo;
  preferences: ITripPreferences;
  groupingScore: number;
  isGrouped: boolean;
  groupedWith: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  // Methods
  addPassenger(userId: Types.ObjectId): Promise<ITrip>;
  removePassenger(userId: Types.ObjectId): Promise<ITrip>;
  confirmRequest(userId: Types.ObjectId): Promise<ITrip>;
  rejectRequest(userId: Types.ObjectId): Promise<ITrip>;
}

/**
 * Trip Schema - Represents a carpool trip to a match
 */
const TripSchema: Schema = new Schema(
  {
    driver: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'Driver is required'] 
    },
    match: { 
      type: Schema.Types.ObjectId, 
      ref: 'Match', 
      required: [true, 'Match is required'] 
    },
    departureLocation: { 
      type: String, 
      required: [true, 'Departure location is required'],
      trim: true 
    },
    departureTime: { 
      type: Date, 
      required: [true, 'Departure time is required'] 
    },
    availableSeats: { 
      type: Number, 
      required: [true, 'Available seats is required'],
      min: [0, 'Available seats cannot be negative'],
      max: [10, 'Maximum 10 seats allowed']
    },
    passengers: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    requests: [{
      user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
      },
      status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'rejected'],
        default: 'pending' 
      },
      requestedAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    messages: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Message' 
    }],
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending' 
    },
    vehicleInfo: {
      make: { type: String, trim: true },
      model: { type: String, trim: true },
      color: { type: String, trim: true },
      plateNumber: { type: String, trim: true }
    },
    preferences: {
      smoking: { type: Boolean, default: false },
      music: { type: Boolean, default: true },
      conversation: { type: Boolean, default: true }
    },
    groupingScore: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 100 
    },
    isGrouped: { 
      type: Boolean, 
      default: false 
    },
    groupedWith: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Trip' 
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for confirmed passengers count
TripSchema.virtual('confirmedPassengers').get(function(this: ITrip) {
  return this.passengers.length;
});

// Method to add a passenger
TripSchema.methods.addPassenger = async function(userId: Types.ObjectId): Promise<ITrip> {
  if (this.availableSeats <= 0) {
    throw new Error('No available seats');
  }
  if (this.passengers.includes(userId)) {
    throw new Error('User is already a passenger');
  }
  this.passengers.push(userId);
  this.availableSeats -= 1;
  return this.save();
};

// Method to remove a passenger
TripSchema.methods.removePassenger = async function(userId: Types.ObjectId): Promise<ITrip> {
  const index = this.passengers.findIndex((p: Types.ObjectId) => p.equals(userId));
  if (index === -1) {
    throw new Error('User is not a passenger');
  }
  this.passengers.splice(index, 1);
  this.availableSeats += 1;
  return this.save();
};

// Method to confirm a request
TripSchema.methods.confirmRequest = async function(userId: Types.ObjectId): Promise<ITrip> {
  const request = this.requests.find((r: IPassengerRequest) => 
    (r.user as Types.ObjectId).equals(userId) && r.status === 'pending'
  );
  if (!request) {
    throw new Error('Request not found');
  }
  request.status = 'confirmed';
  await this.addPassenger(userId);
  return this.save();
};

// Method to reject a request
TripSchema.methods.rejectRequest = async function(userId: Types.ObjectId): Promise<ITrip> {
  const request = this.requests.find((r: IPassengerRequest) => 
    (r.user as Types.ObjectId).equals(userId) && r.status === 'pending'
  );
  if (!request) {
    throw new Error('Request not found');
  }
  request.status = 'rejected';
  return this.save();
};

// Indexes for efficient queries
TripSchema.index({ driver: 1 });
TripSchema.index({ match: 1 });
TripSchema.index({ status: 1 });
TripSchema.index({ departureTime: 1 });
TripSchema.index({ departureLocation: 1 });
TripSchema.index({ availableSeats: 1 });

const Trip: Model<ITrip> = mongoose.model<ITrip>('Trip', TripSchema);
export default Trip;
