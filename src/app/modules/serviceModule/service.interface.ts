import { Document, Types } from 'mongoose';

export interface IService extends Document {
  name: string;
  outlet: {
    outletId: Types.ObjectId;
    name: string;
    type: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  isDiscount: boolean;
  discount: {
    type: string;
    amount: number;
    currency: string;
  };
  image: string;
  consumeCount: number;
  isHomeServiceAvailable: boolean;
}
