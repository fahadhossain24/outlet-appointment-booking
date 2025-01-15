import Earning from './earning.model';

// service for retrive earning by outletId
const retriveEarningByOutletId = async (id: string) => {
  const earning = await Earning.findOne({ 'outlet.outletId': id });
  if(!earning){
    return null;
  }

  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyEarning = earning.earnings.filter(e => e.createdAt >= oneWeekAgo).reduce(
    (total, entry) => ({
      amount: total.amount + entry.amount,
      currency: entry.currency, // Assuming a single currency
    }),
    { amount: 0, currency: earning.totalEarning.currency }
  );

  return {
    totalEarning: earning.totalEarning,
    weeklyEarning: weeklyEarning,
  };
};

export default {
  retriveEarningByOutletId,
};
