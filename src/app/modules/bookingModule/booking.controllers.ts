import { Request, Response } from 'express';
import bookingServices from './booking.services';
import CustomError from '../../errors';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import Booking from './booking.model';
import outletServices from '../outletModule/outlet.services';
import scheduleServices from '../scheduleModule/schedule.services';
import { parseTime } from '../../../utils/parseTime';
import Service from '../serviceModule/service.model';
import notificationServices from '../notificationModule/notification.services';
import createNotification from '../../../utils/notificationCreator';
import feedbackServices from '../feedbackModule/feedback.services';
import sendMail from '../../../utils/sendEmail';
import config from '../../../config';

// controller for create new booking
const createBooking = async (req: Request, res: Response) => {
  const bookingData = req.body;
  const selectedDate = new Date(bookingData.date);
  const currentDate = new Date();

  // Ensure the booking date is not in the past
  if (selectedDate < currentDate) {
    throw new CustomError.BadRequestError('Booking date cannot be in the past. Please select a valid future date.');
  }

  // Check for home service availability
  if (bookingData.homeService) {
    const service = await Service.findOne({ _id: bookingData.service.serviceId });
    if (!service) {
      throw new CustomError.BadRequestError('The Service currently not available!');
    }

    if (!service.isHomeServiceAvailable) {
      throw new CustomError.BadRequestError('The service has no home facility!');
    }
  }

  // Get schedule for the selected outlet
  const schedule = await scheduleServices.getScheduleByOutletId(bookingData.outlet.outletId as unknown as string);
  if (schedule) {
    const dayIndex = selectedDate.getDay();
    const daySchedule = schedule?.daySlot.find((s) => s.dayIndex === dayIndex);

    if (!daySchedule || daySchedule.isClosed) {
      throw new CustomError.BadRequestError('The selected day is outside the outlet’s operating schedule.');
    }

    // Validate selected time within open and close hours
    const selectedTime = bookingData.time; // Time provided in the request, e.g., '10:00 AM'
    const [openHour, openMinute] = parseTime(daySchedule.openTime);
    const [closeHour, closeMinute] = parseTime(daySchedule.closeTime);

    const selectedHourMinute = parseTime(selectedTime);
    const isWithinSchedule =
      (selectedHourMinute[0] > openHour || (selectedHourMinute[0] === openHour && selectedHourMinute[1] >= openMinute)) &&
      (selectedHourMinute[0] < closeHour || (selectedHourMinute[0] === closeHour && selectedHourMinute[1] <= closeMinute));

    if (!isWithinSchedule) {
      throw new CustomError.BadRequestError('The selected time is outside the outlet’s operating hours.');
    }

    // Check capacity for the selected time slot
    const existingBookings = await bookingServices.getBookingsByDateAndTime(bookingData.date, selectedTime, bookingData.outlet.outletId);

    if (existingBookings.length >= schedule.capacityOnTime) {
      throw new CustomError.BadRequestError('The selected time slot is fully booked. Please choose another time slot.');
    }
  }

  // Create the booking
  const booking = await bookingServices.createBooking(bookingData);
  if (!booking) {
    throw new CustomError.BadRequestError('Failed to create booking!');
  }

  // create notification for new booking creation
  createNotification(
    bookingData.user.userId,
    bookingData.user.name,
    `New appointment booked in ${bookingData.outlet.name}, time at ${booking.createdAt}`,
  );

  // send notify mail to outlet owner email address
  const outlet = await outletServices.getSpecificOutlet(bookingData.outlet.outletId);
  if (outlet) {
    // send mail to outlet owner
    // send verification mail
    const textContent = `
Hello ${outlet.name},

You have received a new booking at your outlet.

Booking Details:
- Customer Name: ${bookingData.user.name}
- Customer Address: ${bookingData.user.address}
- Service: ${bookingData.service.name}
- Booking Date: ${new Date(bookingData.date).toLocaleDateString()}
- Booking Time: ${bookingData.time}
- Home Service: ${bookingData.homeService ? 'Yes' : 'No'}
- Payment Type: ${bookingData.paymentType}
- Payment Status: ${bookingData.paymentStatus}
- Transaction ID: ${bookingData.paymentSource.transactionId}

Outlet Address:
${bookingData.outlet.address}

Please ensure everything is ready for the appointment.

Best regards,
Your Booking System Team
`;

    const mailOptions = {
      from: config.gmail_app_user as string,
      to: outlet.email,
      subject: `New booking in from ${bookingData.user.name} at ${new Date(bookingData.date).toLocaleDateString()} and time is ${bookingData.time}`,
      text: textContent,
    };
    sendMail(mailOptions);
  }

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: 'Booking creation successful',
    data: booking,
  });
};

// controller for retrive booking by userId
const getBookingsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  if (!userId) {
    throw new CustomError.BadRequestError('Missing userId in request params!');
  }

  const skip = (page - 1) * limit;
  const bookings = await bookingServices.getBookingsByUserId(userId, skip, limit);

  // const feedbacks = await feedbackServices.getFeedbacksByOutletId(bookings.outlet.outletId)

  // let feedbacksOfSpecificOutlet = [];

  // bookings.map(booking => {
  //   const feedbacks = feedbackServices.getFeedbacksByOutletId(booking.outlet.outletId)
  //   feedbacksOfSpecificOutlet.push(feedbacks)
  // })

  const totalBookings = bookings.length || 0;
  const totalPages = Math.ceil(totalBookings / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Bookings retrive successfull!',
    meta: {
      totalData: totalBookings,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: bookings,
  });
};

// controller for retrive booking by outletId
const getBookingsByOutletId = async (req: Request, res: Response) => {
  const { outletId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  if (!outletId) {
    throw new CustomError.BadRequestError('Missing outletId in request params!');
  }

  const skip = (page - 1) * limit;
  const bookings = await bookingServices.getbookingsByOutletId(outletId, skip, limit);

  const totalBookings = bookings.length || 0;
  const totalPages = Math.ceil(totalBookings / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Bookings retrive successfull!',
    meta: {
      totalData: totalBookings,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: bookings,
  });
};

// controller for retrive booking by outletId
const getBookingsByServiceId = async (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  if (!serviceId) {
    throw new CustomError.BadRequestError('Missing serviceId in request params!');
  }

  const skip = (page - 1) * limit;
  const bookings = await bookingServices.getBookingsByServiceId(serviceId, skip, limit);

  const totalBookings = bookings.length || 0;
  const totalPages = Math.ceil(totalBookings / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Bookings retrive successfull!',
    meta: {
      totalData: totalBookings,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: bookings,
  });
};

// controller for retrive upcomming bookings by userId
const retriveUpcommingBookingsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    throw new CustomError.BadRequestError('Missing userId in request params!');
  }

  const bookings = await bookingServices.getUpcommingBookingsByUserId(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Upcomming bookings retrive successfull!',
    data: bookings,
  });
};

// controller for retrive upcomming bookings by outletId
const retriveUpcommingBookingsByOutletId = async (req: Request, res: Response) => {
  const { outletId } = req.params;
  const { date } = req.query;
  if (!outletId) {
    throw new CustomError.BadRequestError('Missing userId in request params!');
  }

  const bookings = await bookingServices.getUpcommingBookingsByOutletId(outletId, date as string);
  console.log(bookings);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Upcomming bookings retrive successfull!',
    data: bookings,
  });
};

// controller for reschedule booking
const bookingRescheduleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const newDate = req.body.date;
  const booking = await Booking.findOne({ _id: id });
  if (!booking) {
    throw new CustomError.BadRequestError('Failed to retrive booking!');
  }

  const selectedDate = new Date(newDate);
  const currentDate = new Date();

  if (selectedDate < currentDate) {
    throw new CustomError.BadRequestError('Booking date cannot be in the past. Please select a valid future date!');
  }

  const schedule = await scheduleServices.getScheduleByOutletId(booking.outlet.outletId as unknown as string);

  if (!schedule || !schedule.daySlot) {
    throw new CustomError.BadRequestError('No schedule found for the selected outlet.');
  }

  const dayIndex = selectedDate.getDay();

  // Find the schedule entry for the selected day
  const daySchedule = schedule?.daySlot.find((s) => s.dayIndex === dayIndex);

  if (!daySchedule || daySchedule.isClosed) {
    throw new CustomError.BadRequestError('The selected day is outside the outlet’s operating schedule.');
  }

  // Check if the time is within open and close hours
  const selectedTime = selectedDate.toTimeString().split(' ')[0]; // Extract time as HH:MM:SS
  const [selectedHour, selectedMinute] = selectedTime.split(':').map(Number);

  const [openHour, openMinute] = parseTime(daySchedule.openTime);
  const [closeHour, closeMinute] = parseTime(daySchedule.closeTime);

  const isWithinSchedule =
    (selectedHour > openHour || (selectedHour === openHour && selectedMinute >= openMinute)) &&
    (selectedHour < closeHour || (selectedHour === closeHour && selectedMinute <= closeMinute));

  if (!isWithinSchedule) {
    throw new CustomError.BadRequestError('The selected time is outside the outlet’s operating hours.');
  }

  // Proceed to update booking with the new date
  booking.date = selectedDate;
  await booking.save();

  sendResponse(res, {
    statusCode: 200,
    status: 'success',
    message: 'Booking rescheduled successfully!',
  });
};

// controller for retrive all bookings
const retriveAllBookings = async (req: Request, res: Response) => {
  const { query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;

  const skip = (page - 1) * limit;
  const bookings = await bookingServices.getBookings(query as string, skip, limit);

  const totalBookings = bookings.length || 0;
  const totalPages = Math.ceil(totalBookings / limit);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Bookings retrive successfull!',
    meta: {
      totalData: totalBookings,
      totalPage: totalPages,
      currentPage: page,
      limit: limit,
    },
    data: bookings,
  });
};

export default {
  createBooking,
  getBookingsByUserId,
  getBookingsByOutletId,
  getBookingsByServiceId,
  retriveUpcommingBookingsByUserId,
  retriveUpcommingBookingsByOutletId,
  bookingRescheduleById,
  retriveAllBookings,
};
