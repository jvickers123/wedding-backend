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
exports.deleteAccomodation = exports.updateAccomodation = exports.createAccomodation = exports.getSingleAccomodation = exports.getAllAccomodation = void 0;
const Accomodation_1 = __importDefault(require("../models/Accomodation"));
const mongoose_1 = require("mongoose");
const async_1 = require("../middleware/async");
const errorResponse_1 = require("../utils/errorResponse");
/**
 * Gets all accomodation
 * @route GET /api/v1/accomodation
 * @access Public
 */
exports.getAllAccomodation = (0, async_1.asyncHandler)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const allAccomodation = yield Accomodation_1.default.find().populate('guests', 'name');
    res.status(200).json({
        success: true,
        data: allAccomodation,
    });
}));
/**
 * Gets single accomodatoin
 * @route GET /api/v1/accomodation/:id
 * @access Public
 */
exports.getSingleAccomodation = (0, async_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const accomoation = yield Accomodation_1.default.findById(req.params.id).populate('guests', 'name');
    if (!accomoation)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    res.status(200).json({
        success: true,
        data: accomoation,
    });
}));
/**
 * Create accomodation
 * @route POST /api/v1/accomodation
 * @access Private
 */
exports.createAccomodation = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const newAcomodation = yield Accomodation_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: newAcomodation,
    });
}));
/**
 * Update accomodation
 * @route PUT /api/v1/accomodation/:id
 * @access Private
 */
exports.updateAccomodation = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const accomodationToUpdate = yield Accomodation_1.default.findById(req.params.id);
    if (!accomodationToUpdate)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    const updatedAccomodation = yield Accomodation_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(201).json({
        success: true,
        data: updatedAccomodation,
    });
}));
/**
 * Delete guest
 * @route DELETE /api/v1/accomodation/:id
 * @access Private
 */
exports.deleteAccomodation = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const accomodationToDelete = yield Accomodation_1.default.findById(req.params.id);
    if (!accomodationToDelete)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    if (req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to delete this accomodation`, 403);
    }
    accomodationToDelete.remove();
    res.status(201).json({
        success: true,
        data: {},
    });
}));
