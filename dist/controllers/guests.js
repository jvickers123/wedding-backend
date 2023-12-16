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
exports.deleteGuests = exports.updateGuest = exports.createGuests = exports.getSingleGuests = exports.getGuests = void 0;
const Guests_1 = __importDefault(require("../models/Guests"));
const mongoose_1 = require("mongoose");
const async_1 = require("../middleware/async");
const errorResponse_1 = require("../utils/errorResponse");
/**
 * Gets all guests
 * @route GET /api/v1/guests
 * @access Public
 */
exports.getGuests = (0, async_1.asyncHandler)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const guests = yield Guests_1.default.find();
    res.status(200).json({
        success: true,
        data: guests,
    });
}));
/**
 * Gets single guest
 * @route GET /api/v1/guest/:id
 * @access Public
 */
exports.getSingleGuests = (0, async_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const guest = yield Guests_1.default.findById(req.params.id);
    if (!guest)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    if (req.user.email !== guest.email && req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to update this bootcamp`, 403);
    }
    res.status(200).json({
        success: true,
        data: guest,
    });
}));
/**
 * Create guest
 * @route POST /api/v1/guests
 * @access Private
 */
exports.createGuests = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.user)
        return next();
    req.body.user = req.user._id;
    // check for published guest
    const publishedGuest = yield Guests_1.default.findOne({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    if (publishedGuest && req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`The user with id ${req.user._id} has already published a bootcamp`, 400);
    }
    const newGuest = yield Guests_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: newGuest,
    });
}));
/**
 * Update guests
 * @route POST /api/v1/guests/:id
 * @access Private
 */
exports.updateGuest = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const guestToUpdate = yield Guests_1.default.findById(req.params.id);
    if (!guestToUpdate)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    const updatedGuest = yield Guests_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(201).json({
        success: true,
        data: updatedGuest,
    });
}));
/**
 * Delete guest
 * @route POST /api/v1/guests/:id
 * @access Private
 */
exports.deleteGuests = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    const guestToDelete = yield Guests_1.default.findById(req.params.id);
    if (!guestToDelete)
        throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
    if (req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to delete this bootcamp`, 403);
    }
    guestToDelete.remove();
    res.status(201).json({
        success: true,
        data: {},
    });
}));
