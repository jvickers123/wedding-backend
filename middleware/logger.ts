import { NextFunction, Request, Response } from 'express';

const logger = (req: Request, _res: Response, next: NextFunction) => {
  console.log('Middleware ran');
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

export default logger;
