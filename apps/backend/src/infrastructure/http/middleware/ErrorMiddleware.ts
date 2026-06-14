import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { env } from '../../config/env';

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  console.error('Unexpected error:', err);

  if (env.NODE_ENV === 'development') {
    return ApiResponse.error(res, err.message || 'Internal server error', 500, [err.stack]);
  }

  return ApiResponse.error(res, 'Internal server error', 500);
};