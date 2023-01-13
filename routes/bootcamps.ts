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
import { advancedResults } from '../middleware/advancedResults';
import Bootcamp from '../models/Bootcamp';
import courseRouter from './courses';

const router = Router();

// Reroute into other resourse routers
router.use('/:bootcampId/courses', courseRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(uploadPhotoForBootcamp);

export default router;
