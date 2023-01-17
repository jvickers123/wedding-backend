import { NextFunction, Request, Response } from 'express';
import {
  AdvancedResults,
  RequestWithUser,
  ResponseWithPagination,
} from '../helpers/types';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (
    req: Request | RequestWithUser,
    res: Response | ResponseWithPagination,
    next: NextFunction
  ) =>
    Promise.resolve(fn(req, res, next).catch(next));
