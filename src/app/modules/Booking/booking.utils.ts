import { BookingStatus, TBookingStatus } from "./booking.type";

export function getBookingStatus(startTime: Date, endTime: Date): TBookingStatus {
  const now = new Date();

  if (now < startTime) {
    return BookingStatus.UPCOMING;
  } else if (now >= startTime && now <= endTime) {
    return BookingStatus.ONGOING;
  } else {
    return BookingStatus.PAST;
  }
}
