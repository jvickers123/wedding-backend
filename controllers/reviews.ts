import Review from '../models/Review';
import Bootcamp from '../models/Bootcamp';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import {
  RequestWithUser,
  ResponseWithPagination,
  UserRole,
} from '../helpers/types';
import { ErrorResponse } from '../utils/errorResponse';

/**
 * Get Review
 * @route GET /api/v1/reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @access public
 */
export const getReviews = asyncHandler(
  async (req, res: ResponseWithPagination, _next) => {
    const spearchWithinBootcamp: { bootcamp?: string } = {};

    if (req.params.bootcampId) {
      spearchWithinBootcamp.bootcamp = req.params.bootcampId;

      const reviews = await Review.find(spearchWithinBootcamp).populate({
        path: 'bootcamp',
        select: 'name description',
      });

      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  }
);

/**
 * Get Single Review
 * @route GET /api/v1/reviews/:reviewId
 * @access public
 */
export const getSingleReview = asyncHandler(async (req, res, _next) => {
  const review = await Review.findById(req.params.reviewId).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) throw new Error.CastError('string', req.params.reviewId, '_id');

  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * Create Review
 * @route POST /api/v1/bootcamps/:bootcampId/reviews
 * @access private
 */
export const addReview = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user._id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp)
      throw new Error.CastError('string', req.params.bootcampId, '_id');

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review,
    });
  }
);

/**
 * Update Review
 * @route PUT /api/v1/reviews/:reviewId
 * @access private
 */
export const updateReview = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const reviewToUpdate = await Review.findById(req.params.reviewId);

    if (!reviewToUpdate)
      throw new Error.CastError('string', req.params.reviewId, '_id');

    if (
      req.user._id?.toString() !== reviewToUpdate.user.toString() &&
      req.user.role !== UserRole.ADMIN
    ) {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this course`,
        403
      );
    }
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { runValidators: true, new: true }
    );

    res.status(201).json({
      success: true,
      data: updatedReview,
    });
  }
);

/**
 * Delete Review
 * @route DELETE /api/v1/reviews/:reviewId
 * @access private
 */
export const deleteReview = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const reviewToDelete = await Review.findById(req.params.reviewId);

    if (!reviewToDelete)
      throw new Error.CastError('string', req.params.reviewId, '_id');

    if (
      req.user._id?.toString() !== reviewToDelete.user.toString() &&
      req.user.role !== UserRole.ADMIN
    ) {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this course`,
        403
      );
    }

    await reviewToDelete.remove();

    res.status(201).json({
      success: true,
      data: {},
    });
  }
);
