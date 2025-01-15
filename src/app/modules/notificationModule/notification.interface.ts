import { Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: {
    userId: Types.ObjectId;
    name: string;
  };
  content: string;
  isDismissed: boolean;
}
