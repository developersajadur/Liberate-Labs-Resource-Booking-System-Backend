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


export const bookingController = {
  createBooking,
};