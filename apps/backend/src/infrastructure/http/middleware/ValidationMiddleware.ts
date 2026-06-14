import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../../utils/ApiError';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      const messages = error.errors?.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
      next(new ApiError(400, `Validasi gagal: ${messages}`));
    }
  };
};