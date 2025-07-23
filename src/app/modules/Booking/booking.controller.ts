/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import catchAsync from "../../helpers/catchAsync";
import sendResponse from "../../helpers/sendResponse";
import { bookingService } from "./booking.service";


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
  const { resourceName, date } = req.query;

  const filters: any = {
    resourceName: typeof resourceName === "string" ? resourceName : undefined,
    date: typeof date === "string" ? date : undefined,
  };

  const bookings = await bookingService.getAllBookings(filters);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Bookings retrieved successfully',
    data: bookings,
  });
});


export const bookingController = {
  createBooking,
  getAllBookings
};
