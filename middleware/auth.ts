import jwt from 'jsonwebtoken';
import { asyncHandler } from './async';
import { ErrorResponse } from '../utils/errorResponse';
import { Error } from 'mongoose';
import User from '../models/User';
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser, UserRole } from '../helpers/types';

// Protect routes
export const protect = asyncHandler(async (req: RequestWithUser, res, next) => {
  let token: string = '';

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  if (!token.length) throw new Error('Not authorized to access this');

  try {
    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const user = await User.findById(decoded.id);

    if (!user) throw new Error.CastError('string', req.params.id, '_id');
    req.user = user;

    next();
  } catch (error) {
    throw new Error('Not authorized to access this');
  }
});

export const authorize =
  (...roles: UserRole[]) =>
  (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return next();

    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse(
        `User role ${req.user.role} is not authorised to access this route`,
        403
      );
    }
    next();
  };
