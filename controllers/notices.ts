import type { Response } from 'express';
import Notice from '../models/Notices';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import { RequestWithUser } from '../helpers/types';
import { ErrorResponse } from '../utils/errorResponse';

/**
 * Gets all Notice
 * @route GET /api/v1/Notice
 * @access Public
 */
export const getAllNotices = asyncHandler(
  async (_req, res: Response, _next) => {
    const allNotice = await Notice.find().populate('user', 'name');

    res.status(200).json({
      success: true,
      data: allNotice,
    });
  }
);

/**
 * Gets single notice
 * @route GET /api/v1/Notice/:id
 * @access Public
 */
export const getSingleNotice = asyncHandler(async (req, res: Response) => {
  const notice = await Notice.findById(req.params.id).populate('user', 'name');

  if (!notice) throw new Error.CastError('string', req.params.id, '_id');

  res.status(200).json({
    success: true,
    data: notice,
  });
});

/**
 * Create Notice
 * @route POST /api/v1/Notice
 * @access Private
 */
export const createNotice = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    if (req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this Notice`,
        403
      );
    }

    const body = { ...req.body, user: req.user._id };
    const newNotice = await Notice.create(body);

    res.status(201).json({
      success: true,
      data: newNotice,
    });
  }
);

/**
 * Update Notice
 * @route PUT /api/v1/Notice/:id
 * @access Private
 */
export const updateNotice = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    if (req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this Notice`,
        403
      );
    }

    const NoticeToUpdate = await Notice.findById(req.params.id);

    if (!NoticeToUpdate)
      throw new Error.CastError('string', req.params.id, '_id');

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      success: true,
      data: updatedNotice,
    });
  }
);

/**
 * Delete guest
 * @route DELETE /api/v1/Notice/:id
 * @access Private
 */
export const deleteNotice = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const NoticeToDelete = await Notice.findById(req.params.id);

    if (!NoticeToDelete)
      throw new Error.CastError('string', req.params.id, '_id');

    if (req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this Notice`,
        403
      );
    }

    NoticeToDelete.remove();
    res.status(201).json({
      success: true,
      data: {},
    });
  }
);
