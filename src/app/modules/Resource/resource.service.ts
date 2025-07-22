import { status } from 'http-status';
import { Resource } from '@prisma/client';
import prisma from '../../utils/client';
import AppError from '../../errors/AppError';

const createResource = async (data: Resource): Promise<Resource> => {
  const existing = await prisma.resource.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existing) {
    throw new AppError(status.CONFLICT, 'Resource with this name already exists.');
  }

  return prisma.resource.create({ data });
};

export const resourceService = {
  createResource,
};
