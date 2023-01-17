import { Router } from 'express';
import { getReviews } from '../controllers/reviews';
import { advancedResults } from '../middleware/advancedResults';
import { protect, authorize } from '../middleware/auth';
import Review from '../models/Review';

const router = Router();

router.route('/').get(
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews
);

export default router;
