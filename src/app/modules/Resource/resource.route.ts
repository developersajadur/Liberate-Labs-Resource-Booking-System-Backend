import express from 'express';
import { resourceController } from './resource.controller';
import { resourceValidationSchema } from './resource.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/resources',
  validateRequest(resourceValidationSchema.creteResource),
  resourceController.createResource,
);

export const resourceRoutes = router;
