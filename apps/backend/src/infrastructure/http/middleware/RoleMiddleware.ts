import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError';

export const RoleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const userRole = (req as any).user.role;
    
    if (!allowedRoles.includes(userRole)) {
      throw new ApiError(403, 'Forbidden: Anda tidak memiliki akses ke resource ini');
    }

    next();
  };
};