import { Types } from "mongoose";
import notificationServices from "../app/modules/notificationModule/notification.services";

const createNotification = async (userId: Types.ObjectId, userName: string, content: string) => {
  // create notification for add new service into wishlist
  const notificationPayload = {
    user: {
      userId: userId,
      name: userName,
    },
    content: content,
  };

  await notificationServices.createNotification(notificationPayload);
};

export default createNotification