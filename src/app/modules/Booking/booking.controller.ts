/* eslint-disable @typescript-eslint/no-explicit-any */
import status from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import sendResponse from '../../helpers/sendResponse';
import { bookingService } from './booking.service';
import AppError from '../../errors/AppError';

const createBooking = catchAsync(async (req, res) => {
  const bookingData = await bookingService.createBooking(req.body);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Booking created successfully',
    data: bookingData,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const { resourceName, date, resourceId } = req.query;

  const filters: any = {
    resourceId: typeof resourceId === 'string' ? resourceId : undefined,
    resourceName: typeof resourceName === 'string' ? resourceName : undefined,
    date: typeof date === 'string' ? date : undefined,
  };

  const bookings = await bookingService.getAllBookings(filters);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: bookings,
  });
});

const cancelBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  await bookingService.cancelBooking(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Booking cancelled successfully',
    data: null,
  });
});

const getAvailableSlots = catchAsync(async (req, res) => {
  const { resourceId, date, duration } = req.query;

  if (!resourceId || !date) {
    throw new AppError(status.BAD_REQUEST, 'resourceId and date are required');
  }

  const slots = await bookingService.getAvailableSlots(
    resourceId as string,
    date as string,
    parseInt(duration as string, 10),
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Available slots fetched successfully',
    data: slots,
  });
});

export const bookingController = {
  createBooking,
  getAllBookings,
  cancelBooking,
  getAvailableSlots,
};
