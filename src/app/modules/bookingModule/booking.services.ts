import { IBooking } from './booking.interface';
import Booking from './booking.model';

// service for create new booking
const createBooking = async (data: Partial<IBooking>) => {
  return await Booking.create(data);
};

// service for retrive all bookings by userId
const getBookingsByUserId = async (userId: string, skip: number, limit: number) => {
  return await Booking.find({ 'user.userId': userId }).sort('-createdAt').populate({
    path: "outlet.outletId",
    select: 'email phone profileImage'
  }).skip(skip).limit(limit);
};

// service for retrive all bookings
const getBookings = async (query: string, skip: number, limit: number) => {
  const filter: any = {};
  if (query) {
    filter.$text = { $search: query };
  }
  return await Booking.find(filter)
    .populate({
      path: 'service.serviceId',
      select: 'isDiscount discount',
    })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);
};

// service for retrive all bookings by outletId
const getbookingsByOutletId = async (outletId: string, skip: number, limit: number) => {
  console.log(outletId);
  return await Booking.find({ 'outlet.outletId': outletId }).sort('-createdAt').skip(skip).limit(limit);
};

// service for retrive all bookings by serviceId
const getBookingsByServiceId = async (serviceId: string, skip: number, limit: number) => {
  return await Booking.find({ 'service.serviceId': serviceId }).sort('-createdAt').skip(skip).limit(limit);
};

// service for retrive all upcomming bookings by userId
const getUpcommingBookingsByUserId = async (userId: string) => {
  return await Booking.find({ 'user.userId': userId, bookingStatus: 'upcomming' }).select('outlet service date');
};

// service for retrive all upcomming bookings by outletId
const getUpcommingBookingsByOutletId = async (outletId: string, date: string) => {
  const newDate = new Date(date);
  const bookings = await Booking.find({ 'outlet.outletId': outletId, bookingStatus: 'upcomming' })
    .populate({
      path: 'user.userId',
      select: 'email phone image',
    })
    .populate({
      path: 'service.serviceId',
      select: 'isDiscount discount',
    })
    .select('-outlet');

  // Filter bookings to match only the date part
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date); // Convert booking date to Date object
    // Compare only year, month, and day
    return (
      bookingDate.getFullYear() === newDate.getFullYear() &&
      bookingDate.getMonth() === newDate.getMonth() &&
      bookingDate.getDate() === newDate.getDate()
    );
  });

  return date ? filteredBookings : bookings;
};

// service for get booking by DateAndTime
const getBookingsByDateAndTime = async (date: string, time: string, outletId: string) => {
  return await Booking.find({
    date,
    time,
    'outlet.outletId': outletId,
  });
};

export default {
  createBooking,
  getBookingsByServiceId,
  getBookingsByUserId,
  getBookings,
  getbookingsByOutletId,
  getUpcommingBookingsByUserId,
  getUpcommingBookingsByOutletId,
  getBookingsByDateAndTime,
};
