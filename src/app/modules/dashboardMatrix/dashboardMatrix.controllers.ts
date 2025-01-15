import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import Earning from '../earningModule/earning.model';
import Outlet from '../outletModule/outlet.model';
import User from '../userModule/user.model';
import { Request, Response } from 'express';
import Feedback from '../feedbackModule/feedback.model';

// Controller for retrieving admin dashboard matrix
const retriveDashboardMatrix = async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalOutlets = await Outlet.countDocuments({ role: 'outlet' });

  const totalEarningsResult = await Earning.aggregate([
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$amount' },
      },
    },
  ]);
  const totalEarnings = totalEarningsResult[0]?.totalEarnings || 0;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize data structures
  const userStats = Array(12).fill(0);
  const outletStats = Array(12).fill(0);
  const earningStats = Array(12).fill(0);

  // Fetch total users and group by month
  const usersByMonth = await User.aggregate([
    { $match: { role: 'user' } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
  ]);

  usersByMonth.forEach(({ _id, count }) => {
    userStats[_id - 1] = count;
  });

  // Fetch total outlets and group by month
  const outletsByMonth = await Outlet.aggregate([
    { $match: { role: 'outlet' } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
  ]);

  outletsByMonth.forEach(({ _id, count }) => {
    outletStats[_id - 1] = count;
  });

  // Fetch total earnings and group by month
  const earningsByMonth = await Earning.aggregate([
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalEarning: { $sum: '$totalEarning.amount' },
      },
    },
  ]);
  console.log(earningsByMonth);
  earningsByMonth.forEach(({ _id, totalEarning }) => {
    earningStats[_id - 1] = totalEarning;
  });

  // Calculate percentages for each section
  const maxUsers = Math.max(...userStats) || 1; // Avoid division by zero
  const maxEarnings = Math.max(...earningStats) || 1;
  const maxOutlets = Math.max(...outletStats) || 1;

  // retrive feedback
  const feedbacks = await Feedback.find().sort('-createdAt').populate({
    path: 'user.userId',
    select: 'phone, image, email'
  }).populate({
    path: 'outlet.outletId',
    select: 'email phone image'
  })

  const responseData = {
    totalUsers,
    totalOutlets,
    totalEarnings,
    chartData: {
      months,
      userStatistics: userStats.map((value) => (value / maxUsers) * 100), // Percentage values for users
      earningStatistics: earningStats.map((value) => (value / maxEarnings) * 100), // Percentage values for earnings
      outletStatistics: outletStats.map((value) => (value / maxOutlets) * 100), // Percentage values for outlets
    },
    feedbacks,
  };

  // Send the response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Dashboard metrics retrieved successfully!',
    data: responseData,
  });
};

export default {
  retriveDashboardMatrix,
};
