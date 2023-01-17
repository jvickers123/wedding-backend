import { Router } from 'express';
import {
  getBootcamps,
  getSingleBootcamp,
  getBootcampsInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadPhotoForBootcamp,
} from '../controllers/bootcamps';
import { UserRole } from '../helpers/types';
import { advancedResults } from '../middleware/advancedResults';
import { authorize, protect } from '../middleware/auth';
import Bootcamp from '../models/Bootcamp';
import courseRouter from './courses';
import reviewRouter from './reviews';

const router = Router();

// Reroute into other resourse routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), createBootcamp);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), updateBootcamp)
  .delete(
    protect,
    authorize(UserRole.PUBLISHER, UserRole.ADMIN),
    deleteBootcamp
  );

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(
    protect,
    authorize(UserRole.PUBLISHER, UserRole.ADMIN),
    uploadPhotoForBootcamp
  );

export default router;
