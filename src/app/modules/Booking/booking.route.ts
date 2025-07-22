import { Router } from 'express';
import { bookingController } from './booking.controller';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidationSchema } from './booking.validation';

const router = Router();

router.post(
  '/bookings',
  validateRequest(bookingValidationSchema.createBooking),
  bookingController.createBooking,
);

export const bookingRoutes = router;
