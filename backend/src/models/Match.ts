import mongoose, { Document, Model, Schema } from 'mongoose';

/**
 * Interface for Match document
 */
export interface IMatch extends Document {
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  matchDate: Date;
  competition: string;
  entryCenter: string;
  isUpcoming: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Match Schema - Represents a football match
 */
const MatchSchema: Schema = new Schema(
  {
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
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for quick queries
MatchSchema.index({ matchDate: 1 });
MatchSchema.index({ isUpcoming: 1 });
MatchSchema.index({ homeTeam: 1, awayTeam: 1 });

// Virtual to get match title
MatchSchema.virtual('title').get(function(this: IMatch) {
  return `${this.homeTeam} vs ${this.awayTeam}`;
});

const Match: Model<IMatch> = mongoose.model<IMatch>('Match', MatchSchema);
export default Match;
