import mongoose, { Document, Model, Schema, Types } from 'mongoose';

/**
 * Interface for Message document
 */
export interface IMessage extends Document {
  trip: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  timestamp: Date;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Message Schema - Represents a message in a trip chat
 */
const MessageSchema: Schema = new Schema(
  {
    trip: { 
      type: Schema.Types.ObjectId, 
      ref: 'Trip', 
      required: [true, 'Trip reference is required'] 
    },
    sender: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'Sender reference is required'] 
    },
    content: { 
      type: String, 
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    read: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for efficient queries
MessageSchema.index({ trip: 1, timestamp: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ read: 1 });

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;
