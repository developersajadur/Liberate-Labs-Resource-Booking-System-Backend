import { Booking } from '@prisma/client';
import prisma from '../../utils/client';
import AppError from '../../errors/AppError';
import status from 'http-status';

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


// export async function getBookings(filter?: {
//   resourceId?: string;
//   date?: string;
// }) {
//   const { resourceId, date } = filter || {};

//   const where: Prisma.BookingWhereInput = {
//     isDeleted: false,
//     ...(resourceId && { resourceId }),
//     ...(date && {
//       startTime: {
//         gte: new Date(date + 'T00:00:00.000Z'),
//         lt: new Date(new Date(date + 'T00:00:00.000Z').getTime() + 86400000),
//       },
//     }),
//   };

//   const bookings = await prisma.booking.findMany({
//     where,
//     orderBy: { startTime: 'asc' },
//     include: { resource: true },
//   });

//   const now = new Date();

//   return bookings.map((booking) => {
//     let status: 'UPCOMING' | 'ONGOING' | 'PAST';
//     if (now < booking.startTime) status = 'UPCOMING';
//     else if (now > booking.endTime) status = 'PAST';
//     else status = 'ONGOING';

//     return { ...booking, status };
//   });
// }

export const bookingService = {
  createBooking,
};
