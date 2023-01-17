import { Router } from 'express';
import {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses';
import Course from '../models/Course';
import { authorize, protect } from '../middleware/auth';
import { advancedResults } from '../middleware/advancedResults';
import { UserRole } from '../helpers/types';

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(advancedResults(Course), getCourses)
  .post(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), createCourse);
router
  .route('/:courseId')
  .get(getSingleCourse)
  .put(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), updateCourse)
  .delete(protect, authorize(UserRole.PUBLISHER, UserRole.ADMIN), deleteCourse);

export default router;
