/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from '@prisma/client';
import prisma from '../../utils/client';
import AppError from '../../errors/AppError';
import status from 'http-status';
import { TBookingFilter } from './booking.type';

const BUFFER_MINUTES = 10;
const MIN_DURATION_MINUTES = 15;

const createBooking = async (data: Booking): Promise<Booking> => {
  const { resourceId } = data;

  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  const isResourceExist = await prisma.resource.findUnique({
    where: { id: resourceId },
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

const getAllBookings = async (filter?:TBookingFilter ) => {
  // console.log(filter, filter);
  let resourceId: string | undefined;

  if (filter?.resourceName) {
    const resource = await prisma.resource.findFirst({
      where: {
        name: {
          contains: filter.resourceName,
          // mode: 'insensitive' 
        },
      },
    });


    if (!resource) {
      return [];
    }
    resourceId = resource.id;
  }

  const filters: any = {
    isDeleted: false,
  };

  if (resourceId) {
    filters.resourceId = resourceId;
  }

  if (filter?.date) {
    const parsedDate = new Date(filter.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
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
      startTime: "asc",
    },
  });

  return bookings;
};


export const bookingService = {
  createBooking,
  getAllBookings
};
