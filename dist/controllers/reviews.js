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
exports.deleteReview = exports.updateReview = exports.addReview = exports.getSingleReview = exports.getReviews = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const Bootcamp_1 = __importDefault(require("../models/Bootcamp"));
const mongoose_1 = require("mongoose");
const async_1 = require("../middleware/async");
const types_1 = require("../helpers/types");
const errorResponse_1 = require("../utils/errorResponse");
/**
 * Get Review
 * @route GET /api/v1/reviews
 * @route GET /api/v1/bootcamps/:bootcampId/reviews
 * @access public
 */
exports.getReviews = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const spearchWithinBootcamp = {};
    if (req.params.bootcampId) {
        spearchWithinBootcamp.bootcamp = req.params.bootcampId;
        const reviews = yield Review_1.default.find(spearchWithinBootcamp).populate({
            path: 'bootcamp',
            select: 'name description',
        });
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
}));
/**
 * Get Single Review
 * @route GET /api/v1/reviews/:reviewId
 * @access public
 */
exports.getSingleReview = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review_1.default.findById(req.params.reviewId).populate({
        path: 'bootcamp',
        select: 'name description',
    });
    if (!review)
        throw new mongoose_1.Error.CastError('string', req.params.reviewId, '_id');
    res.status(200).json({
        success: true,
        data: review,
    });
}));
/**
 * Create Review
 * @route POST /api/v1/bootcamps/:bootcampId/reviews
 * @access private
 */
exports.addReview = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user._id;
    const bootcamp = yield Bootcamp_1.default.findById(req.params.bootcampId);
    if (!bootcamp)
        throw new mongoose_1.Error.CastError('string', req.params.bootcampId, '_id');
    const review = yield Review_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: review,
    });
}));
/**
 * Update Review
 * @route PUT /api/v1/reviews/:reviewId
 * @access private
 */
exports.updateReview = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const reviewToUpdate = yield Review_1.default.findById(req.params.reviewId);
    if (!reviewToUpdate)
        throw new mongoose_1.Error.CastError('string', req.params.reviewId, '_id');
    if (((_a = req.user._id) === null || _a === void 0 ? void 0 : _a.toString()) !== reviewToUpdate.user.toString() &&
        req.user.role !== types_1.UserRole.ADMIN) {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to delete this course`, 403);
    }
    const updatedReview = yield Review_1.default.findByIdAndUpdate(req.params.reviewId, req.body, { runValidators: true, new: true });
    res.status(201).json({
        success: true,
        data: updatedReview,
    });
}));
/**
 * Delete Review
 * @route DELETE /api/v1/reviews/:reviewId
 * @access private
 */
exports.deleteReview = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const reviewToDelete = yield Review_1.default.findById(req.params.reviewId);
    if (!reviewToDelete)
        throw new mongoose_1.Error.CastError('string', req.params.reviewId, '_id');
    if (((_b = req.user._id) === null || _b === void 0 ? void 0 : _b.toString()) !== reviewToDelete.user.toString() &&
        req.user.role !== types_1.UserRole.ADMIN) {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to delete this course`, 403);
    }
    yield reviewToDelete.remove();
    res.status(201).json({
        success: true,
        data: {},
    });
}));
