import type { Response } from 'express';
import Guests from '../models/Guests';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import { RequestWithUser } from '../helpers/types';
import { ErrorResponse } from '../utils/errorResponse';

/**
 * Gets all guests
 * @route GET /api/v1/guests
 * @access Public
 */
export const getGuests = asyncHandler(async (_req, res: Response, next) => {
  const guests = await Guests.find();

  res.status(200).json({
    success: true,
    data: guests,
  });
});

/**
 * Gets single guest
 * @route GET /api/v1/guest/:id
 * @access Public
 */
export const getSingleGuests = asyncHandler(
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const guest = await Guests.findById(req.params.id);

    if (!guest) throw new Error.CastError('string', req.params.id, '_id');

    if (req.user.email !== guest.email && req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to update this bootcamp`,
        403
      );
    }

    res.status(200).json({
      success: true,
      data: guest,
    });
  }
);

/**
 * Create guest
 * @route POST /api/v1/guests
 * @access Private
 */
export const createGuests = asyncHandler(
  async (req: RequestWithUser, res: Response, next) => {
    if (!req.user) return next();

    req.body.user = req.user._id;

    // check for published guest
    const publishedGuest = await Guests.findOne({ user: req.user?._id });

    if (publishedGuest && req.user.role !== 'admin') {
      throw new ErrorResponse(
        `The user with id ${req.user._id} has already published a bootcamp`,
        400
      );
    }
    const newGuest = await Guests.create(req.body);
    res.status(201).json({
      success: true,
      data: newGuest,
    });
  }
);

/**
 * Update guests
 * @route POST /api/v1/guests/:id
 * @access Private
 */
export const updateGuest = asyncHandler(async (req, res: Response, _next) => {
  const guestToUpdate = await Guests.findById(req.params.id);

  if (!guestToUpdate) throw new Error.CastError('string', req.params.id, '_id');

  const updatedGuest = await Guests.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: updatedGuest,
  });
});

/**
 * Delete guest
 * @route POST /api/v1/guests/:id
 * @access Private
 */
export const deleteGuests = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const guestToDelete = await Guests.findById(req.params.id);

    if (!guestToDelete)
      throw new Error.CastError('string', req.params.id, '_id');

    if (req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this bootcamp`,
        403
      );
    }

    guestToDelete.remove();
    res.status(201).json({
      success: true,
      data: {},
    });
  }
);
