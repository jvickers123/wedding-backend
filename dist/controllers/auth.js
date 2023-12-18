"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updateDetails = exports.resetPassword = exports.forgotPassword = exports.getMe = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = require("mongoose");
const async_1 = require("../middleware/async");
const sendEmail_1 = require("../utils/sendEmail");
const errorResponse_1 = require("../utils/errorResponse");
const crypto_1 = __importDefault(require("crypto"));
const sendTokenResponse = ({ user, statusCode, res, }) => {
    const token = user.getSignedJWTToken();
    const noDays = process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000;
    const options = {
        expires: new Date(Date.now() + noDays),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production')
        options.secure = true;
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
exports.registerUser = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.create(req.body);
    const token = user.getSignedJWTToken();
    res.status(200).json({ success: true, token });
}));
/**
 * Login user
 *
 * @route POST api/v1/auth/register
 * @access public
 */
exports.loginUser = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        throw new mongoose_1.Error('Please provide an email and password');
    const user = yield User_1.default.findOne({ email }).select('+password');
    if (!user) {
        throw new mongoose_1.Error('Invalid credentials');
    }
    // check if password matches
    const isMatched = yield user.matchPasswords(password);
    if (!isMatched)
        throw new mongoose_1.Error('Invalid credentials');
    sendTokenResponse({ user, statusCode: 200, res });
}));
/**
 * Logout user
 * @route GET /api/v1/auth/logout
 * @access private
 */
exports.logoutUser = (0, async_1.asyncHandler)((_, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        data: {},
    });
}));
/**
 * Get current Logged in user
 * @route POST /api/v1/auth/me
 * @access private
 */
exports.getMe = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const user = yield User_1.default.findById(req.user._id);
    res.status(200).json({
        success: true,
        data: user,
    });
}));
/**
 * Forgot password
 * @route POST /api/v1/auth/forgotpassword
 * @access private
 */
exports.forgotPassword = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user)
        throw new mongoose_1.Error('No user with that email');
    const resetToken = user.getResetPasswordToken();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    try {
        (0, sendEmail_1.sendEmail)({
            email: req.body.email,
            text: message,
            subject: 'Password Reset Function',
        });
    }
    catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        throw new errorResponse_1.ErrorResponse('Email could not be sent', 500);
    }
    user.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        data: 'Email sent',
    });
}));
/**
 * Reset Password
 * @route PUT /api/v1/auth/resetpassword/:resettoken
 * @access public
 */
exports.resetPassword = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');
    const user = yield User_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gte: Date.now() },
    });
    if (!user) {
        throw new errorResponse_1.ErrorResponse('Invalid Token', 400);
    }
    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    yield user.save();
    sendTokenResponse({ user, statusCode: 200, res });
}));
/**
 * Update details
 * @route PUT api/v1/auth/updatedetails
 * @access private
 */
exports.updateDetails = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const fieldsToUpdate = {
        email: req.body.email,
        name: req.body.name,
    };
    const user = yield User_1.default.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
}));
/**
 * Update password
 * @route PUT api/v1/auth/updatepassword
 * @access private
 */
exports.updatePassword = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const user = yield User_1.default.findById(req.user._id).select('+password');
    if (!user) {
        throw new mongoose_1.Error('Could not retrieve user details');
    }
    if (!(yield user.matchPasswords(req.body.currentPassword))) {
        throw new errorResponse_1.ErrorResponse('Password is incorrect', 401);
    }
    user.password = req.body.newPassword;
    yield user.save();
    sendTokenResponse({ user, statusCode: 200, res });
}));
