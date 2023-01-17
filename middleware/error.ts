import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../utils/errorResponse';
import { Error } from 'mongoose';

const errorHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  console.log(error, err, { ...err });
  // mongoose bad object id
  if (err.name === 'CastError') {
    const castError = err as unknown as Error.CastError;
    const message = `Nothing found with id ${castError.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Duplicate name error
  if ('code' in err && err.code === 11000) {
    const message = 'Duplicate Value entered';
    error = new ErrorResponse(message, 400);
  }

  // Missing fields
  if (err.name === 'ValidationError' && 'errors' in err) {
    const validationErrors = err.errors as unknown as Error.ValidatorError[];
    const message = Object.values(validationErrors)
      .map((error) => error.message)
      .join(', ');
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'MongooseError') {
    error.message = err.message;
    if (err.message !== 'There was a problem with file upload') {
      error.statusCode = 400;
    }
    if (
      err.message === 'Invalid credentials' ||
      err.message === 'Not authorized to access this'
    ) {
      error.statusCode = 401;
    }
  }

  if (
    err.message.includes(' has already published a bootcamp') ||
    err.message.includes('is not authorised to access this route') ||
    err.message.includes('is not authorised to') ||
    err.message === 'No user with that email' ||
    err.message === 'Email could not be sent' ||
    err.message === 'Invalid Token' ||
    err.message === 'Password is incorrect'
  ) {
    error.message = err.message;
    error.statusCode = err.statusCode;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
