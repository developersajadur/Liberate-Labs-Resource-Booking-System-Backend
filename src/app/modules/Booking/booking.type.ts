import { Booking } from "@prisma/client";



export const BookingStatus = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  PAST: 'PAST',
} as const;

export type TBookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];


export type  TBookingFilter = {
  resourceId?: string;
  resourceName?: string;
  date?: string; // YYYY-MM-DD
};
export type BookingWithStatus = Booking & {
  status: 'Upcoming' | 'Ongoing' | 'Past';
  resource: {
    id: string;
    name: string;
  };
};

export type TAvailableSlot = { startTime: Date; endTime: Date };