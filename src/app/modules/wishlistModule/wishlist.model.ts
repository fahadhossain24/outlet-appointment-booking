import mongoose from 'mongoose';
import { IWishlist } from './wishlist.interface';

const wishlistSchema = new mongoose.Schema<IWishlist>(
  {
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      name: String,
      address: String,
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'service',
        },
        name: String,
        price: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wishlist = mongoose.model<IWishlist>('wishlist', wishlistSchema);
export default Wishlist;
