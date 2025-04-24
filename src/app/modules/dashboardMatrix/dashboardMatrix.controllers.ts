import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import Earning from '../earningModule/earning.model';
import Outlet from '../outletModule/outlet.model';
import User from '../userModule/user.model';
import { Request, Response } from 'express';
import Feedback from '../feedbackModule/feedback.model';

// Controller for retrieving admin dashboard matrix
const retriveDashboardMatrix = async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

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
  const userStats = Array(12).fill(0);
  const outletStats = Array(12).fill(0);
  const earningStats = Array(12).fill(0);

  // Users grouped by month & filtered by year
  const usersByMonth = await User.aggregate([
    {
      $match: {
        role: 'user',
        $expr: {
          $eq: [{ $year: '$createdAt' }, year],
        },
      },
    },
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

  // Outlets grouped by month & filtered by year
  const outletsByMonth = await Outlet.aggregate([
    {
      $match: {
        role: 'outlet',
        $expr: {
          $eq: [{ $year: '$createdAt' }, year],
        },
      },
    },
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

  // Earnings grouped by month & filtered by year
  const earningsByMonth = await Earning.aggregate([
    {
      $match: {
        $expr: {
          $eq: [{ $year: '$createdAt' }, year],
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalEarning: { $sum: '$totalEarning.amount' },
      },
    },
  ]);
  earningsByMonth.forEach(({ _id, totalEarning }) => {
    earningStats[_id - 1] = totalEarning;
  });

  // Calculate max values for percentage calculation
  const maxUsers = Math.max(...userStats) || 1;
  const maxEarnings = Math.max(...earningStats) || 1;
  const maxOutlets = Math.max(...outletStats) || 1;

  // Retrieve feedbacks (no filter by year)
  const feedbacks = await Feedback.find()
    .sort('-createdAt')
    .populate({
      path: 'user.userId',
      select: 'phone image email',
    })
    .populate({
      path: 'outlet.outletId',
      select: 'email phone image',
    });

  const responseData = {
    totalUsers,
    totalOutlets,
    maxEarnings,
    chartData: {
      months,
      userStatistics: userStats.map((value) => (value / maxUsers) * 100),
      earningStatistics: earningStats.map((value) => (value / maxEarnings) * 100),
      outletStatistics: outletStats.map((value) => (value / maxOutlets) * 100),
    },
    feedbacks,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: `Dashboard metrics for year ${year} retrieved successfully!`,
    data: responseData,
  });
};

export default {
  retriveDashboardMatrix,
};
