import mongoose from 'mongoose';
import { IBooking } from './booking.interface';

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    user: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      name: String,
      address: String,
    },
    outlet: {
      outletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'outlet',
      },
      name: String,
      address: String,
    },
    service: {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service',
      },
      name: String,
      price: {
        amount: Number,
        currency: String,
      },
    },
    date: Date,
    time: String,
    paymentType: {
      type: String,
      enum: {
        values: ['cash-on', 'online'],
        message: '{VALUE} is not supported as payment type. Please use cash-on/online as payment type!',
      },
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['paid', 'unpaid'],
        message: '{VALUE} is not supported as payment status. Please use paid/unpaid as payment status!',
      },
    },
    paymentSource: {
      type: {
        type: String,
        enum: {
          values: ['card', 'internet-banking', 'bank'],
          message: '{VALUE} is not supported as payment source type. Please use bank/card/internet-banking as payment source type!',
        },
      },
      number: String,
      transactionId: String,
    },
    bookingStatus: {
      type: String,
      enum: ['upcomming', 'past', 'completed', 'canceled'],
      default: 'upcomming',
    },
    homeService: Boolean,
  },
  {
    timestamps: true,
  },
);

bookingSchema.index(
  {
    'user.name': 'text',
    'user.address': 'text',
    'outlet.name': 'text',
    'outlet.address': 'text',
    'paymentStatus': 'text',
    'paymentSource.type': 'text',
    'paymentType': 'text',
    'bookingStatus': 'text',
  },
  {
    weights: {
      'user.name': 5,
      'user.address': 4,
      'outlet.name': 5,
      'outlet.address': 4,
      'paymentStatus': 3,
      'paymentSource.type': 4,
      'paymentType': 3,
      'bookingStatus': 2,
    },
    name: 'BookingTextIndex',
  }
);


const Booking = mongoose.model<IBooking>('booking', bookingSchema);
export default Booking;
