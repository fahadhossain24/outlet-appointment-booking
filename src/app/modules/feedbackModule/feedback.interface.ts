import { Document, Types } from 'mongoose';

export interface IFeedback extends Document {
  user: {
    userId: Types.ObjectId;
    name: string;
    address: string;
  };
  outlet: {
    outletId: Types.ObjectId;
    type: string;
    name: string;
    address: string;
  };
  rating: number;
  comment: string;
  booking: Types.ObjectId;
}
