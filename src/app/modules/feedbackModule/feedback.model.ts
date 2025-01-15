import mongoose from 'mongoose';
import { IFeedback } from './feedback.interface';

const feedbackSchema = new mongoose.Schema<IFeedback>(
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
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking"
    }
  },
  {
    timestamps: true,
  },
);

const Feedback = mongoose.model<IFeedback>('feedback', feedbackSchema);
export default Feedback;
