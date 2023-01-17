import { asyncHandler } from '../middleware/async';
import Course from '../models/Course';
import Bootcamp from '../models/Bootcamp';
import { Error } from 'mongoose';
import { RequestWithUser, ResponseWithPagination } from '../helpers/types';
import { ErrorResponse } from '../utils/errorResponse';

/**
 * Get Courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access public
 */
export const getCourses = asyncHandler(
  async (req, res: ResponseWithPagination, _next) => {
    const spearchWithinBootcamp: { bootcamp?: string } = {};

    if (req.params.bootcampId) {
      spearchWithinBootcamp.bootcamp = req.params.bootcampId;

      const courses = await Course.find(spearchWithinBootcamp).populate({
        path: 'bootcamp',
        select: 'name description',
      });

      res.status(200).json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } else {
      res.status(200).json(res.advancedResults);
    }
  }
);

/**
 * Get Single Courses
 * @route GET /api/v1/courses/:courseId
 * @access public
 */
export const getSingleCourse = asyncHandler(async (req, res, _next) => {
  const course = await Course.findById(req.params.courseId).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) throw new Error.CastError('string', req.params.courseId, '_id');
  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * Get Single Courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access private
 */
export const createCourse = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp)
      throw new Error.CastError('string', req.params.courseId, '_id');

    if (req.user._id !== bootcamp.user?._id && req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to add a course to this bootcamp`,
        403
      );
    }

    const course = await Course.create(req.body);

    res.status(200).json({
      success: true,
      data: course,
    });
  }
);

/**
 * Update Courses
 * @route PUT /api/v1/courses/:courseId
 * @access private
 */
export const updateCourse = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const courseToUpdate = await Course.findById(req.params.courseId);

    if (!courseToUpdate)
      throw new Error.CastError('string', req.params.courseId, '_id');

    if (req.user._id !== courseToUpdate.user && req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to update this course`,
        403
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  }
);

/**
 * Delete Course
 * @route DELETE /api/v1/courses/:courseId
 * @access private
 */
export const deleteCourse = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const courseToDelete = await Course.findById(req.params.courseId);

    if (!courseToDelete)
      throw new Error.CastError('string', req.params.courseId, '_id');

    if (req.user._id !== courseToDelete.user && req.user.role !== 'admin') {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this course`,
        403
      );
    }

    await courseToDelete.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);
