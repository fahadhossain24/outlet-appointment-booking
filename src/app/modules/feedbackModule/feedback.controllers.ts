import { Request, Response } from 'express';
import feedbackServices from './feedback.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import Service from '../serviceModule/service.model';
import Booking from '../bookingModule/booking.model';
import Earning from '../earningModule/earning.model';
import outletServices from '../outletModule/outlet.services';

// controller for create or update new feedback
const createOrUpdateFeedback = async (req: Request, res: Response) => {
  const feedbackData = req.body;

  const booking = await Booking.findOne({ _id: feedbackData.booking });

  // Ensure outletId is a valid ObjectId
  feedbackData.outlet.outletId = new mongoose.Types.ObjectId(feedbackData.outlet.outletId);

  const existFeedback = await feedbackServices.getSpecificFeedbackByUserIdAndOutletId(
    feedbackData.user.userId,
    feedbackData.outlet.outletId,
  );

  let feedback;
  if (existFeedback) {
    feedback = await feedbackServices.updateSpecificFeedbackByUserIdAndoutletId(
      feedbackData.user.userId,
      feedbackData.outlet.outletId,
      feedbackData,
    );
  } else {
    feedback = await feedbackServices.createFeedback(feedbackData);
  }

  if (booking && existFeedback?.booking.toString() !== feedbackData.booking) {
    booking.bookingStatus = 'completed';
    await booking.save();
    const earningOfOutlet = await Earning.findOne({ 'outlet.outletId': feedbackData.outlet.outletId });

    if (earningOfOutlet) {
      earningOfOutlet.earnings.push({
        amount: booking.service.price.amount,
        currency: booking.service.price.currency,
        createdAt: new Date(),
      });
      earningOfOutlet.totalEarning.amount = earningOfOutlet.totalEarning.amount + booking.service.price.amount;
      earningOfOutlet.totalEarning.currency = booking.service.price.currency;
      await earningOfOutlet.save();
    } else {
      const payload = {
        earnings: [
          {
            amount: booking.service.price.amount,
            currency: booking.service.price.currency,
            createdAt: new Date(),
          },
        ],
        outlet: {
          outletId: feedbackData.outlet.outletId,
          name: feedbackData.outlet.name,
          type: feedbackData.outlet.type,
        },
        totalEarning: {
          amount: booking.service.price.amount,
          currency: booking.service.price.currency,
        },
      };
      await Earning.create(payload);
    }
  }

  const existingFeedbacksByOutletId = await feedbackServices.getFeedbacksByOutletId(feedbackData.outlet.outletId);
  let totalRating = 0;
  existingFeedbacksByOutletId.forEach((feedback) => {
    totalRating += feedback.rating;
  });
  const rating: any = totalRating / existingFeedbacksByOutletId.length;

  await outletServices.updateSpecificOutlet(feedbackData.outlet.outletId, { rating: rating.toFixed(1)});

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Feedback operation successful!`,
    data: feedback,
  });
};

// controller for get feedbacks by outletId
const getFeedbacksByOutletIds = async (req: Request, res: Response) => {
  const { outletId } = req.params;
  const feedbacks = await feedbackServices.getFeedbacksByOutletId(outletId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Feedbacks retrive successful!`,
    data: feedbacks,
  });
};

export default {
  createOrUpdateFeedback,
  getFeedbacksByOutletIds,
};
