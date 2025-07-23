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

router.get('/bookings', bookingController.getAllBookings);
router.delete('/bookings/:id', bookingController.cancelBooking);
router.get('/available-slots', bookingController.getAvailableSlots);

export const bookingRoutes = router;
