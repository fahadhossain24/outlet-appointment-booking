// controller for get all notifications by userId

import { Request, Response } from 'express';
import notificationServices from './notification.services';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../../errors';

const getNotificationsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const notifications = await notificationServices.getAllNotificationByUserId(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Notifications retrive successful!`,
    data: notifications,
  });
};

// controller for update notifications status by by id
const updateNotificationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const status = req.body.isDismissed;
  const updatedNotification = await notificationServices.updateNotificationByUserId(id, status);
  if (!updatedNotification.modifiedCount) {
    throw new CustomError.BadRequestError('Failed to update notification!');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Notification updated successfull!',
  });
};

export default {
  getNotificationsByUserId,
  updateNotificationById,
};
