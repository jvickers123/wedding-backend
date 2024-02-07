import type { Response } from 'express';
import Accomodation from '../models/Accomodation';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import { RequestWithUser } from '../helpers/types';
import { ErrorResponse } from '../utils/errorResponse';

/**
 * Gets all accomodation
 * @route GET /api/v1/accomodation
 * @access Public
 */
export const getAllAccomodation = asyncHandler(
  async (_req, res: Response, _next) => {
    const allAccomodation = await Accomodation.find().populate({
      path: 'users',
      select: 'name',
    });

    res.status(200).json({
      success: true,
      data: allAccomodation,
    });
  }
);

/**
 * Gets single accomodatoin
 * @route GET /api/v1/accomodation/:id
 * @access Public
 */
export const getSingleAccomodation = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const accomoation = await Accomodation.findById(req.params.id).populate({
      path: 'users',
      select: 'name',
    });

    if (!accomoation) throw new Error.CastError('string', req.params.id, '_id');

    res.status(200).json({
      success: true,
      data: accomoation,
    });
  }
);

/**
 * Create accomodation
 * @route POST /api/v1/accomodation
 * @access Private
 */
export const createAccomodation = asyncHandler(
  async (req, res: Response, _next) => {
    const newAcomodation = await Accomodation.create(req.body);

    res.status(201).json({
      success: true,
      data: newAcomodation,
    });
  }
);

/**
 * Update accomodation
 * @route PUT /api/v1/accomodation/:id
 * @access Private
 */
export const updateAccomodation = asyncHandler(
  async (req, res: Response, _next) => {
    const accomodationToUpdate = await Accomodation.findById(req.params.id);

    if (!accomodationToUpdate)
      throw new Error.CastError('string', req.params.id, '_id');

    const updatedAccomodation = await Accomodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      success: true,
      data: updatedAccomodation,
    });
  }
);

/**
 * Delete guest
 * @route DELETE /api/v1/accomodation/:id
 * @access Private
 */
export const deleteAccomodation = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const accomodationToDelete = await Accomodation.findById(req.params.id);

    if (!accomodationToDelete)
      throw new Error.CastError('string', req.params.id, '_id');

    if (req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this accomodation`,
        403
      );
    }

    accomodationToDelete.remove();
    res.status(201).json({
      success: true,
      data: {},
    });
  }
);
