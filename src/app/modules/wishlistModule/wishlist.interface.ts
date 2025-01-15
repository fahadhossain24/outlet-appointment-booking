import { Document, Types } from 'mongoose';

export interface IWishlist extends Document {
  user: {
    userId: Types.ObjectId;
    name: string;
    address: string;
  };
  services: [
    {
      serviceId: Types.ObjectId;
      name: string;
      price: number;
    },
  ];
}
