import { Document, Types } from 'mongoose';

export interface IConversation extends Document {
  user: {
    name: string;
    userId: string;
  };
  lastMessage: Types.ObjectId;
  isActive: boolean;
}
