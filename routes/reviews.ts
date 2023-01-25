import { Router } from 'express';
import {
  addReview,
  deleteReview,
  getReviews,
  getSingleReview,
  updateReview,
} from '../controllers/reviews';
import { UserRole } from '../helpers/types';
import { advancedResults } from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';
import Review from '../models/Review';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize(UserRole.ADMIN, UserRole.USER), addReview);

router
  .route('/:reviewId')
  .get(getSingleReview)
  .put(protect, authorize(UserRole.ADMIN, UserRole.USER), updateReview)
  .delete(protect, authorize(UserRole.ADMIN, UserRole.USER), deleteReview);

export default router;
