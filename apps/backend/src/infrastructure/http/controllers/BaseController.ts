import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';

export abstract class BaseController {
  protected async handleRequest(
    req: Request,
    res: Response,
    next: NextFunction,
    handler: () => Promise<any>
  ) {
    try {
      const result = await handler();
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  protected getUserId(req: Request): string {
    return (req as any).user?.id || '';
  }

  protected getUserRole(req: Request): string {
    return (req as any).user?.role || '';
  }
}