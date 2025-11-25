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
 * Match Schema - Represents a football match
 */
const MatchSchema = new mongoose_1.Schema({
    homeTeam: {
        type: String,
        required: [true, 'Home team is required'],
        trim: true
    },
    awayTeam: {
        type: String,
        required: [true, 'Away team is required'],
        trim: true
    },
    stadium: {
        type: String,
        required: [true, 'Stadium is required'],
        trim: true
    },
    matchDate: {
        type: Date,
        required: [true, 'Match date is required']
    },
    competition: {
        type: String,
        required: [true, 'Competition is required'],
        trim: true
    },
    entryCenter: {
        type: String,
        required: [true, 'Entry center is required'],
        trim: true
    },
    isUpcoming: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for quick queries
MatchSchema.index({ matchDate: 1 });
MatchSchema.index({ isUpcoming: 1 });
MatchSchema.index({ homeTeam: 1, awayTeam: 1 });
// Virtual to get match title
MatchSchema.virtual('title').get(function () {
    return `${this.homeTeam} vs ${this.awayTeam}`;
});
const Match = mongoose_1.default.model('Match', MatchSchema);
exports.default = Match;
