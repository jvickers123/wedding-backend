import { Router } from 'express';
import {
  getCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses';
import Course from '../models/Course';
import { advancedResults } from '../middleware/advancedResults';

const router = Router({ mergeParams: true });

router.route('/').get(advancedResults(Course), getCourses).post(createCourse);
router
  .route('/:courseId')
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);

export default router;
