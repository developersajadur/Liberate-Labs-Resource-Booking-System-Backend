import { z } from 'zod';

const creteResource = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
});

export const resourceValidationSchema = {
  creteResource,
};
