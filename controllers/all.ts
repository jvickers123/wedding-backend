import type { Response } from 'express';
import Accomodation from '../models/Accomodation';
import Guests from '../models/Guests';
import Notices from '../models/Notices';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import { RequestWithUser } from '../helpers/types';
import { ErrorResponse } from '../utils/errorResponse';

/**
 * Gets all data - Guests and accomodation
 * @route GET /api/v1/all
 * @access Public
 */
export const getAll = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    if (req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this accomodation`,
        403
      );
    }

    const accomodation = await Accomodation.find().populate('guests', 'name');

    const guests = await Guests.find();

    const notices = await Notices.find().populate('user', 'name');

    res.status(200).json({
      success: true,
      data: { accomodation, guests, notices },
    });
  }
);
