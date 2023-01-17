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
exports.uploadPhotoForBootcamp = exports.deleteBootcamp = exports.updateBootcamp = exports.createBootcamp = exports.getBootcampsInRadius = exports.getSingleBootcamp = exports.getBootcamps = void 0;
const Bootcamp_1 = __importDefault(require("../models/Bootcamp"));
const mongoose_1 = require("mongoose");
const async_1 = require("../middleware/async");
const geocoder_1 = require("../utils/geocoder");
const path_1 = __importDefault(require("path"));
const errorResponse_1 = require("../utils/errorResponse");
/**
 * Gets all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = (0, async_1.asyncHandler)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(res.advancedResults);
}));
/**
 * Gets single bootcamps
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getSingleBootcamp = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp_1.default.findById(req.params.id);
    if (!bootcamp) {
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
}));
/**
 * Gets all bootcamps within a radius
 * @route GET /api/v1/bootcamps/:zipcode/:distance
 * @access Public
 */
exports.getBootcampsInRadius = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { zipcode, distance } = req.params;
    const loc = yield geocoder_1.geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    // Radius of Earth = 6,378 miles
    const radius = +distance / 6378;
    const bootcamps = yield Bootcamp_1.default.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
}));
/**
 * Create bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user)
        return next();
    req.body.user = req.user._id;
    // check for published bootcamp
    const publishedBootcamp = yield Bootcamp_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (publishedBootcamp && req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`The user with id ${req.user._id} has already published a bootcamp`, 400);
    }
    const newBootcamp = yield Bootcamp_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: newBootcamp,
    });
}));
/**
 * Update bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const bootcampToUpdate = yield Bootcamp_1.default.findById(req.params.id);
    if (!bootcampToUpdate)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    if (req.user._id !== ((_b = bootcampToUpdate.user) === null || _b === void 0 ? void 0 : _b._id) &&
        req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to update this bootcamp`, 403);
    }
    const updatedBootcamp = yield Bootcamp_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(201).json({
        success: true,
        data: updatedBootcamp,
    });
}));
/**
 * Delete bootcamp
 * @route POST /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const bootcampToDelete = yield Bootcamp_1.default.findById(req.params.id);
    if (!bootcampToDelete)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    if (req.user._id !== ((_c = bootcampToDelete.user) === null || _c === void 0 ? void 0 : _c._id) &&
        req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to delete this bootcamp`, 403);
    }
    bootcampToDelete.remove();
    res.status(201).json({
        success: true,
        data: {},
    });
}));
/**
 * Upload photo for bootcamp
 * @route Put /api/v1/bootcamps/:id/photo
 * @access Private
 */
exports.uploadPhotoForBootcamp = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const bootcampToUpdate = yield Bootcamp_1.default.findById(req.params.id);
    if (!bootcampToUpdate)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    if (req.user._id !== ((_d = bootcampToUpdate.user) === null || _d === void 0 ? void 0 : _d._id) &&
        req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to update this bootcamp`, 403);
    }
    if (!req.files)
        throw new mongoose_1.Error('please upload a file');
    const { file } = req.files;
    if (file instanceof Array)
        throw new mongoose_1.Error('Please upload only one photo');
    if (!file.mimetype.startsWith('image'))
        throw new mongoose_1.Error('Please upload an image file');
    console.log(file.size);
    if (file.size > +process.env.MAX_FILE_UPLOAD)
        throw new mongoose_1.Error(`Please upload an image file less than ${+process.env.MAX_FILE_UPLOAD / 10000} mb`);
    // create custom file name
    file.name = `photo_${bootcampToUpdate._id}${path_1.default.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            throw new mongoose_1.Error('There was a problem with file upload');
        }
    }));
    yield Bootcamp_1.default.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
        success: true,
        data: file.name,
    });
}));
