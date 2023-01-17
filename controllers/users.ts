import { asyncHandler } from '../middleware/async';
import User from '../models/User';
import { ResponseWithPagination } from '../helpers/types';

/**
 * Get all users
 * @route GET api/v1/auth/users
 * @access private admin
 */
export const getAllusers = asyncHandler(
  async (_req, res: ResponseWithPagination, _next) => {
    res.status(200).json(res.advancedResults);
  }
);

/**
 * Get single user
 * @route GET api/v1/auth/users
 * @access private admin
 */
export const getSingleUsers = asyncHandler(async (req, res, _next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Create user
 * @route POST api/v1/auth/users
 * @access private admin
 */
export const createUser = asyncHandler(async (req, res, _next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * Update User
 * @route POST api/v1/auth/users
 * @access private admin
 */
export const updateUser = asyncHandler(async (req, res, _next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Delete User
 * @route Delete api/v1/auth/users
 * @access private admin
 */
export const deleteUser = asyncHandler(async (req, res, _next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
