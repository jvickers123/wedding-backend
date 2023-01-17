import type { Response } from 'express';
import Bootcamp from '../models/Bootcamp';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import { geocoder } from '../utils/geocoder';
import path from 'path';
import { RequestWithUser, ResponseWithPagination } from '../helpers/types';
import { ErrorResponse } from '../utils/errorResponse';

/**
 * Gets all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler(
  async (_req, res: ResponseWithPagination, _next) => {
    res.status(200).json(res.advancedResults);
  }
);

/**
 * Gets single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getSingleBootcamp = asyncHandler(
  async (req, res: Response, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      throw new Error.CastError('string', req.params.id, '_id');
    }
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  }
);

/**
 * Gets all bootcamps within a radius
 * @route GET /api/v1/bootcamps/:zipcode/:distance
 * @access Public
 */
export const getBootcampsInRadius = asyncHandler(
  async (req, res: Response, _next) => {
    const { zipcode, distance } = req.params;

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Radius of Earth = 6,378 miles
    const radius = +distance / 6378;

    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  }
);

/**
 * Create bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
export const createBootcamp = asyncHandler(
  async (req: RequestWithUser, res: Response, next) => {
    if (!req.user) return next();

    req.body.user = req.user._id;

    // check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user?._id });

    if (publishedBootcamp && req.user.role !== 'admin') {
      throw new ErrorResponse(
        `The user with id ${req.user._id} has already published a bootcamp`,
        400
      );
    }
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: newBootcamp,
    });
  }
);

/**
 * Update bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
export const updateBootcamp = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const bootcampToUpdate = await Bootcamp.findById(req.params.id);

    if (!bootcampToUpdate)
      throw new Error.CastError('string', req.params.id, '_id');

    if (
      req.user._id !== bootcampToUpdate.user?._id &&
      req.user.role !== 'admin'
    ) {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to update this bootcamp`,
        403
      );
    }

    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(201).json({
      success: true,
      data: updatedBootcamp,
    });
  }
);

/**
 * Delete bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
export const deleteBootcamp = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const bootcampToDelete = await Bootcamp.findById(req.params.id);

    if (!bootcampToDelete)
      throw new Error.CastError('string', req.params.id, '_id');

    if (
      req.user._id !== bootcampToDelete.user?._id &&
      req.user.role !== 'admin'
    ) {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to delete this bootcamp`,
        403
      );
    }

    bootcampToDelete.remove();
    res.status(201).json({
      success: true,
      data: {},
    });
  }
);

/**
 * Upload photo for bootcamp
 * @route Put /api/v1/bootcamps/:id/photo
 * @access Private
 */
export const uploadPhotoForBootcamp = asyncHandler(
  async (req: RequestWithUser, res: Response, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const bootcampToUpdate = await Bootcamp.findById(req.params.id);

    if (!bootcampToUpdate)
      throw new Error.CastError('string', req.params.id, '_id');

    if (
      req.user._id !== bootcampToUpdate.user?._id &&
      req.user.role !== 'admin'
    ) {
      throw new ErrorResponse(
        `User id ${req.user._id} is not authorised to update this bootcamp`,
        403
      );
    }

    if (!req.files) throw new Error('please upload a file');

    const { file } = req.files;

    if (file instanceof Array) throw new Error('Please upload only one photo');

    if (!file.mimetype.startsWith('image'))
      throw new Error('Please upload an image file');
    console.log(file.size);
    if (file.size > +process.env.MAX_FILE_UPLOAD!)
      throw new Error(
        `Please upload an image file less than ${
          +process.env.MAX_FILE_UPLOAD! / 10000
        } mb`
      );

    // create custom file name
    file.name = `photo_${bootcampToUpdate._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        throw new Error('There was a problem with file upload');
      }
    });

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  }
);
