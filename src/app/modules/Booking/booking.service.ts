/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from '@prisma/client';
import prisma from '../../utils/client';
import AppError from '../../errors/AppError';
import status from 'http-status';
import {
  BookingWithStatus,
  TAvailableSlot,
  TBookingFilter,
} from './booking.type';

const BUFFER_MINUTES = 10;
const MIN_DURATION_MINUTES = 15;

const createBooking = async (data: Booking): Promise<Booking> => {
  const { resourceId } = data;

  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  const isResourceExist = await prisma.resource.findUnique({
    where: { id: resourceId, isDeleted: false },
  });

  if (!isResourceExist) {
    throw new AppError(status.NOT_FOUND, 'Resource not found');
  }

  const duration = (endTime.getTime() - startTime.getTime()) / 60000;
  if (duration < MIN_DURATION_MINUTES) {
    throw new AppError(
      status.NOT_ACCEPTABLE,
      'Minimum booking duration is 15 minutes.',
    );
  }

  const bufferStart = new Date(startTime.getTime() - BUFFER_MINUTES * 60000);
  const bufferEnd = new Date(endTime.getTime() + BUFFER_MINUTES * 60000);

  const conflicting = await prisma.booking.findFirst({
    where: {
      resourceId,
      isDeleted: false,
      AND: [{ startTime: { lt: bufferEnd } }, { endTime: { gt: bufferStart } }],
    },
  });

  if (conflicting) {
    throw new AppError(
      status.CONFLICT,
      'Booking conflict detected with buffer time.',
    );
  }

  return prisma.booking.create({
    data: {
      ...data,
      startTime,
      endTime,
    },
  });
};

const getAllBookings = async (
  filter?: TBookingFilter,
): Promise<BookingWithStatus[]> => {
  let resourceId = filter?.resourceId;

  if (!resourceId && filter?.resourceName) {
    const resource = await prisma.resource.findFirst({
      where: {
        name: {
          contains: filter.resourceName,
          // mode: 'insensitive'
        },
        isDeleted: false,
      },
    });

    if (!resource) {
      return [];
    }

    resourceId = resource.id;
  }

  const filters: any = {
    isDeleted: false,
    isCanceled: false,
  };

  if (resourceId) {
    filters.resourceId = resourceId;
  }

  if (filter?.date) {
    const parsedDate = new Date(filter.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }
    const nextDay = new Date(parsedDate);
    nextDay.setDate(parsedDate.getDate() + 1);

    filters.startTime = {
      gte: parsedDate,
      lt: nextDay,
    };
  }

  const bookings = await prisma.booking.findMany({
    where: filters,
    include: {
      resource: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });

  const now = new Date();

  const bookingsWithStatus = bookings.map((booking) => {
    let status: BookingWithStatus['status'];

    if (booking.endTime < now) {
      status = 'Past';
    } else if (booking.startTime <= now && booking.endTime >= now) {
      status = 'Ongoing';
    } else {
      status = 'Upcoming';
    }

    return {
      ...booking,
      status,
    };
  });

  return bookingsWithStatus;
};

const cancelBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.isDeleted || booking.isCanceled) {
    throw new AppError(
      status.NOT_FOUND,
      'Booking not found or already deleted or canceled',
    );
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { isCanceled: true },
  });
};

const getAvailableSlots = async (
  resourceId: string,
  date: string,
  duration: number, // in minutes
): Promise<TAvailableSlot[]> => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const isResourceIdExist = await prisma.resource.findUnique({
    where: { id: resourceId, isDeleted: false },
  });
  if (!isResourceIdExist) {
    throw new AppError(status.NOT_FOUND, 'Resource not found');
  }

  const bookings = await prisma.booking.findMany({
    where: {
      resourceId,
      isDeleted: false,
      isCanceled: false,
      startTime: { lt: dayEnd },
      endTime: { gt: dayStart },
    },
    orderBy: { startTime: "asc" },
  });

  const unavailableIntervals = bookings?.map((booking) => ({
    start: new Date(booking.startTime.getTime() - BUFFER_MINUTES * 60000),
    end: new Date(booking.endTime.getTime() + BUFFER_MINUTES * 60000),
  }));

  const slots: TAvailableSlot[] = [];
  let slotStart = new Date(dayStart);

  while (
    slotStart.getTime() + duration * 60000 <= dayEnd.getTime()
  ) {
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);

    const isOverlapping = unavailableIntervals.some(
      (interval) =>
        slotStart < interval.end && slotEnd > interval.start
    );

    if (!isOverlapping) {
      slots.push({ startTime: new Date(slotStart), endTime: slotEnd });
    }

    slotStart = new Date(slotStart.getTime() + MIN_DURATION_MINUTES * 60000);
  }

  return slots;
};

export const bookingService = {
  createBooking,
  getAllBookings,
  cancelBooking,
  getAvailableSlots,
};
