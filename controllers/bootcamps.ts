import type { Request, Response, NextFunction } from 'express';
import Bootcamp from '../models/Bootcamp';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import { geocoder } from '../utils/geocoder';
import path from 'path';
import { AdvancedResults } from '../helpers/types';

/**
 * Gets all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
export const getBootcamps = asyncHandler(
  async (
    _req: Request,
    res: Response & { advancedResults?: AdvancedResults },
    _next: NextFunction
  ) => {
    res.status(200).json(res.advancedResults);
  }
);

/**
 * Gets single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
export const getSingleBootcamp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  async (req: Request, res: Response, _next: NextFunction) => {
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
  async (req: Request, res: Response, _next: NextFunction) => {
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
  async (req: Request, res: Response, _next: NextFunction) => {
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBootcamp)
      throw new Error.CastError('string', req.params.id, '_id');

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
  async (req: Request, res: Response, _next: NextFunction) => {
    const bootcampToDelete = await Bootcamp.findById(req.params.id);

    if (!bootcampToDelete)
      throw new Error.CastError('string', req.params.id, '_id');

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
  async (req: Request, res: Response, _next: NextFunction) => {
    const bootcampToUpdate = await Bootcamp.findById(req.params.id);

    if (!bootcampToUpdate)
      throw new Error.CastError('string', req.params.id, '_id');

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
