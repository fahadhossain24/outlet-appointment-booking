import mongoose from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new mongoose.Schema<INotification>(
  {
    user: {
      userId: mongoose.Schema.Types.ObjectId,
      name: String
    },
    content: String,
    isDismissed: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model<INotification>('notification', notificationSchema);
export default Notification;
