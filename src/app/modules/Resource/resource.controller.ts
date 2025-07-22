import { Request, Response } from 'express';
import { status } from 'http-status';
import catchAsync from '../../helpers/catchAsync';
import { resourceService } from './resource.service';
import sendResponse from '../../helpers/sendResponse';

const createResource = catchAsync(async (req: Request, res: Response) => {
  const resource = await resourceService.createResource(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Resource created successfully',
    data: resource,
  });
});

export const resourceController = {
  createResource,
};
