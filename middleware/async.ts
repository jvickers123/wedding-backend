import { NextFunction, Request, Response } from 'express';
import { AdvancedResults } from '../helpers/types';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (
    req: Request,
    res: Response | (Response & AdvancedResults),
    next: NextFunction
  ) =>
    Promise.resolve(fn(req, res, next).catch(next));
