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
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getSingleCourse = exports.getCourses = void 0;
const async_1 = require("../middleware/async");
const Course_1 = __importDefault(require("../models/Course"));
const Bootcamp_1 = __importDefault(require("../models/Bootcamp"));
const mongoose_1 = require("mongoose");
const errorResponse_1 = require("../utils/errorResponse");
/**
 * Get Courses
 * @route GET /api/v1/courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access public
 */
exports.getCourses = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const spearchWithinBootcamp = {};
    if (req.params.bootcampId) {
        spearchWithinBootcamp.bootcamp = req.params.bootcampId;
        const courses = yield Course_1.default.find(spearchWithinBootcamp).populate({
            path: 'bootcamp',
            select: 'name description',
        });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
}));
/**
 * Get Single Courses
 * @route GET /api/v1/courses/:courseId
 * @access public
 */
exports.getSingleCourse = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course_1.default.findById(req.params.courseId).populate({
        path: 'bootcamp',
        select: 'name description',
    });
    if (!course)
        throw new mongoose_1.Error.CastError('string', req.params.courseId, '_id');
    res.status(200).json({
        success: true,
        data: course,
    });
}));
/**
 * Get Single Courses
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access private
 */
exports.createCourse = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = yield Bootcamp_1.default.findById(req.params.bootcampId);
    if (!bootcamp)
        throw new mongoose_1.Error.CastError('string', req.params.courseId, '_id');
    if (req.user._id !== ((_a = bootcamp.user) === null || _a === void 0 ? void 0 : _a._id) && req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to add a course to this bootcamp`, 403);
    }
    const course = yield Course_1.default.create(req.body);
    res.status(200).json({
        success: true,
        data: course,
    });
}));
/**
 * Update Courses
 * @route PUT /api/v1/courses/:courseId
 * @access private
 */
exports.updateCourse = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const courseToUpdate = yield Course_1.default.findById(req.params.courseId);
    if (!courseToUpdate)
        throw new mongoose_1.Error.CastError('string', req.params.courseId, '_id');
    if (req.user._id !== courseToUpdate.user && req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to update this course`, 403);
    }
    const updatedCourse = yield Course_1.default.findByIdAndUpdate(req.params.courseId, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: updatedCourse,
    });
}));
/**
 * Delete Course
 * @route DELETE /api/v1/courses/:courseId
 * @access private
 */
exports.deleteCourse = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const courseToDelete = yield Course_1.default.findById(req.params.courseId);
    if (!courseToDelete)
        throw new mongoose_1.Error.CastError('string', req.params.courseId, '_id');
    if (req.user._id !== courseToDelete.user && req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to delete this course`, 403);
    }
    yield courseToDelete.remove();
    res.status(200).json({
        success: true,
        data: {},
    });
}));
