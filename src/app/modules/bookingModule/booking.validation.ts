import z from 'zod';

const createBookingZodSchema = z.object({
  body: z.object({
    user: z.object({
      userId: z.string({
        required_error: 'userId is required!',
      }),
      name: z.string({
        required_error: 'User name is required!',
      }),
      address: z.string({
        required_error: 'User address is required!',
      }),
    }),
    outlet: z.object({
      outletId: z.string({
        required_error: 'outletId is required!',
      }),
      name: z.string({
        required_error: 'Outlet name is required!',
      }),
      address: z.string({
        required_error: 'Outlet address is required!',
      }),
    }),
    service: z.object({
      serviceId: z.string({
        required_error: 'serviceId is required!',
      }),
      name: z.string({
        required_error: 'Service name is required!',
      }),
      price: z.object({
        amount: z.number({
          required_error: 'Price amount is required as a number!',
        }).nonnegative({
          message: 'Price amount must be a non-negative number!',
        }),
        currency: z.string({
          required_error: 'Price currency is required!',
        }).length(3, 'Currency must be a 3-letter ISO code.'),
      }),
    }),
    date: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
      return null;
    }, z.date({
      required_error: 'Date is required!',
    }).refine((date) => date > new Date(), {
      message: 'Booking date cannot be in the past.',
    })),
    paymentType: z.enum(['cash-on', 'online'], {
      required_error: 'Payment type is required!',
      invalid_type_error: 'Invalid payment type! Must be either cash-on or online.',
    }),
    paymentStatus: z.enum(['paid', 'unpaid'], {
      required_error: 'Payment status is required!',
      invalid_type_error: 'Invalid payment status! Must be either paid or unpaid.',
    }),
    paymentSource: z.object({
      type: z.enum(['card', 'internet-banking', 'bank'], {
        required_error: 'Payment source type is required!',
        invalid_type_error: 'Invalid payment source type! Must be card, internet-banking, or bank.',
      }),
      number: z.string({
        required_error: 'Payment source number is required!',
      }),
      transactionId: z.string({
        required_error: 'Transaction ID is required!',
      }),
    }).optional(),
    bookingStatus: z.enum(['upcomming', 'past', 'completed', 'canceled'], {
      required_error: 'Booking status is required!',
      invalid_type_error: 'Invalid booking status!',
    }).default('upcomming'),
  }),
});

const BookingValidationZodSchema = {
  createBookingZodSchema,
};

export default BookingValidationZodSchema;
