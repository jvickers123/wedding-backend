import { asyncHandler } from '../middleware/async';
import Course from '../models/Course';
import Bootcamp from '../models/Bootcamp';
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { AdvancedResults } from '../helpers/types';
/**
 * Get Courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access public
 */
export const getCourses = asyncHandler(
  async (
    req: Request,
    res: Response & { advancedResults?: AdvancedResults },
    _next: NextFunction
  ) => {
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
export const getSingleCourse = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const course = await Course.findById(req.params.courseId).populate({
      path: 'bootcamp',
      select: 'name description',
    });

    if (!course)
      throw new Error.CastError('string', req.params.courseId, '_id');

    res.status(200).json({
      success: true,
      data: course,
    });
  }
);

/**
 * Get Single Courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access private
 */
export const createCourse = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp)
      throw new Error.CastError('string', req.params.courseId, '_id');

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
  async (req: Request, res: Response, _next: NextFunction) => {
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course)
      throw new Error.CastError('string', req.params.courseId, '_id');

    res.status(200).json({
      success: true,
      data: course,
    });
  }
);

/**
 * Delete Course
 * @route DELETE /api/v1/courses/:courseId
 * @access private
 */
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const course = await Course.findById(req.params.courseId);

    if (!course)
      throw new Error.CastError('string', req.params.courseId, '_id');

    await course.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  }
);
