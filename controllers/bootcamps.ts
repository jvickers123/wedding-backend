import type { Request, Response, NextFunction } from 'express';

/**
 * Gets all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

/**
 * Gets single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getSingleBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(200)
    .json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

/**
 * Gets single bootcamps
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(201).json({ success: true, msg: 'Create new bootcamp' });
};

/**
 * Update bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

/**
 * Delete bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
