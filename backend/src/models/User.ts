import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// IUser interface defining the user model fields
export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  region: string;
  favouriteTeam: string;
  supporterGroup: string;
  isDriver: boolean;
  maxSeats: number;
  entryCenter: string;
  interests: string[];
  profilePicture: string;
  role: string;
  isBanned: boolean;
}

// User schema defining the structure of the user document
const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  favouriteTeam: { type: String, required: true },
  supporterGroup: { type: String, required: true },
  isDriver: { type: Boolean, default: false },
  maxSeats: { type: Number, default: 0 },
  entryCenter: { type: String, required: true },
  interests: { type: [String], default: [] },
  profilePicture: { type: String, default: '' },
  role: { type: String, required: true, default: 'user' },
  isBanned: { type: Boolean, default: false },
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre<IUser>('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for quick search
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;
