import type { Response, CookieOptions } from 'express';
import User from '../models/User';
import { RequestWithUser, UserType } from '../helpers/types';
import { Error } from 'mongoose';
import { asyncHandler } from '../middleware/async';
import { sendEmail } from '../utils/sendEmail';
import { ErrorResponse } from '../utils/errorResponse';
import crypto from 'crypto';
import { match } from 'assert';

const sendTokenResponse = ({
  user,
  statusCode,
  res,
}: {
  user: UserType;
  statusCode: number;
  res: Response;
}) => {
  const token = user.getSignedJWTToken();

  const noDays =
    (process.env.JWT_COOKIE_EXPIRE as unknown as number) * 24 * 60 * 60 * 1000;

  const options: CookieOptions = {
    expires: new Date(Date.now() + noDays),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') options.secure = true;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

/**
 * Register user
 *
 * @route POST~ api/v1/auth/register
 * @access public
 */
export const registerUser = asyncHandler(async (req, res, _next) => {
  const user = await User.create(req.body);
  const token = user.getSignedJWTToken();
  res.status(200).json({ success: true, token });
});

/**
 * Login user
 *
 * @route POST api/v1/auth/register
 * @access public
 */
export const loginUser = asyncHandler(async (req, res, _next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new Error('Please provide an email and password');

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // check if password matches
  const isMatched = await user.matchPasswords(password);

  if (!isMatched) throw new Error('Invalid credentials');

  sendTokenResponse({ user, statusCode: 200, res });
});

/**
 * Get current Logged in user
 * @route POST /api/v1/auth/me
 * @access private
 */
export const getMe = asyncHandler(async (req: RequestWithUser, res, _next) => {
  if (!req.user) throw new Error('Could not retrieve user details');
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * Forgot password
 * @route POST /api/v1/auth/forgotpassword
 * @access private
 */
export const forgotPassword = asyncHandler(async (req, res, _next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new Error('No user with that email');

  const resetToken = user.getResetPasswordToken();

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  try {
    sendEmail({
      email: req.body.email,
      text: message,
      subject: 'Password Reset Function',
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ErrorResponse('Email could not be sent', 500);
  }

  user.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    data: 'Email sent',
  });
});

/**
 * Reset Password
 * @route PUT /api/v1/auth/resetpassword/:resettoken
 * @access public
 */
export const resetPassword = asyncHandler(async (req, res, _next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gte: Date.now() },
  });

  if (!user) {
    throw new ErrorResponse('Invalid Token', 400);
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendTokenResponse({ user, statusCode: 200, res });
});

/**
 * Update details
 * @route PUT api/v1/auth/updatedetails
 * @access private
 */
export const updateDetails = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const fieldsToUpdate = {
      email: req.body.email,
      name: req.body.name,
    };

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  }
);

/**
 * Update password
 * @route PUT api/v1/auth/updatepassword
 * @access private
 */
export const updatePassword = asyncHandler(
  async (req: RequestWithUser, res, _next) => {
    if (!req.user) throw new Error('Could not retrieve user details');

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      throw new Error('Could not retrieve user details');
    }

    if (!(await user.matchPasswords(req.body.currentPassword))) {
      throw new ErrorResponse('Password is incorrect', 401);
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse({ user, statusCode: 200, res });
  }
);
