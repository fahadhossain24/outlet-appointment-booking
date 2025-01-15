import { IFeedback } from './feedback.interface';
import Feedback from './feedback.model';

// service for create feedback
const createFeedback = async (data: Partial<IFeedback>) => {
  console.log(data);
  return await Feedback.create(data);
};

// get specific feedback by outletId
const getSpecificFeedbackByOutletId = async (id: string) => {
  return await Feedback.findOne({ 'outlet.outletId': id });
};

// get specific feedback by outletId and userId
const getSpecificFeedbackByUserIdAndOutletId = async (userId: string, outletId: string) => {
  return await Feedback.findOne({ 'user.userId': userId, 'outlet.outletId': outletId });
};

// get feedbacks by outletId
const getFeedbacksByOutletId = async (outletId: string) => {
  return await Feedback.find({'outlet.outletId': outletId }).populate({
    path: "booking",
    select: 'service'
  });
};

// service for update specific feedback by userId and outletId
const updateSpecificFeedbackByUserIdAndoutletId = async (userId: string, outletId: string, data: Partial<IFeedback>) => {
  return await Feedback.updateOne(
    { 'user.userId': userId, 'outlet.outletId': outletId },
    { $set: data }, // Use `$set` to update the object fields properly
    { runValidators: true },
  );
};

export default {
  createFeedback,
  getSpecificFeedbackByOutletId,
  getSpecificFeedbackByUserIdAndOutletId,
  getFeedbacksByOutletId,
  updateSpecificFeedbackByUserIdAndoutletId,
};
