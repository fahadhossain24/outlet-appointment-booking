import mongoose from 'mongoose';
import { IEarning } from './earning.interface';

const earningSchema = new mongoose.Schema<IEarning>(
  {
    earnings: [
      {
        amount: Number,
        currency: String,
        createdAt: Date,
      },
    ],
    outlet: {
      outletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'outlet',
      },
      name: {
        type: String
      },
      type: {
        type: String
      },
    },
    totalEarning: {
      amount: Number,
      currency: String,
    },
  },
  {
    timestamps: true,
  },
);

const Earning = mongoose.model<IEarning>('earning', earningSchema);
export default Earning;
