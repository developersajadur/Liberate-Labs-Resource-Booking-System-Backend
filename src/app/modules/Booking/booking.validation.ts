import { z } from 'zod';

// Booking Zod Schema
export const createBooking = z.object({
  body: z.object({
    resourceId: z.string().uuid('Resource ID must be a valid UUID'),
    startTime: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
      message: 'Start time must be a valid date',
    }),
    endTime: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
      message: 'End time must be a valid date',
    }),
    requestedBy: z.string().min(1, 'Requester name is required'),
  }),
});


export const bookingValidationSchema = {
createBooking
}