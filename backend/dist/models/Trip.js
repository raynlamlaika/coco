"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/**
 * Trip Schema - Represents a carpool trip to a match
 */
const TripSchema = new mongoose_1.Schema({
    driver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Driver is required']
    },
    match: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    requests: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Trip'
        }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Virtual for confirmed passengers count
TripSchema.virtual('confirmedPassengers').get(function () {
    return this.passengers.length;
});
// Method to add a passenger
TripSchema.methods.addPassenger = async function (userId) {
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
TripSchema.methods.removePassenger = async function (userId) {
    const index = this.passengers.findIndex((p) => p.equals(userId));
    if (index === -1) {
        throw new Error('User is not a passenger');
    }
    this.passengers.splice(index, 1);
    this.availableSeats += 1;
    return this.save();
};
// Method to confirm a request
TripSchema.methods.confirmRequest = async function (userId) {
    const request = this.requests.find((r) => r.user.equals(userId) && r.status === 'pending');
    if (!request) {
        throw new Error('Request not found');
    }
    request.status = 'confirmed';
    await this.addPassenger(userId);
    return this.save();
};
// Method to reject a request
TripSchema.methods.rejectRequest = async function (userId) {
    const request = this.requests.find((r) => r.user.equals(userId) && r.status === 'pending');
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
const Trip = mongoose_1.default.model('Trip', TripSchema);
exports.default = Trip;
