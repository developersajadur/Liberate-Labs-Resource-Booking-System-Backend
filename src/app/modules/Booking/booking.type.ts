


export const BookingStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  PAST: 'PAST',
} as const;

export type TBookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];
