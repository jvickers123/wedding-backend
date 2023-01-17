import Review from '../models/Review';
import Bootcamp from '../models/Bootcamp';
import { asyncHandler } from '../middleware/async';
import { ResponseWithPagination } from '../helpers/types';

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
