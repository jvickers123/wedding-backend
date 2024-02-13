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
exports.getGuestsAndAccomodation = void 0;
const Accomodation_1 = __importDefault(require("../models/Accomodation"));
const mongoose_1 = require("mongoose");
const async_1 = require("../middleware/async");
const errorResponse_1 = require("../utils/errorResponse");
const Guests_1 = __importDefault(require("../models/Guests"));
/**
 * Gets all data - Guests and accomodation
 * @route GET /api/v1/all
 * @access Public
 */
exports.getGuestsAndAccomodation = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        throw new mongoose_1.Error('Could not retrieve user details');
    if (req.user.role !== 'admin') {
        throw new errorResponse_1.ErrorResponse(`User id ${req.user._id} is not authorised to delete this accomodation`, 403);
    }
    const accomodation = yield Accomodation_1.default.find().populate({
        path: 'users',
        select: 'name',
    });
    const guests = yield Guests_1.default.find();
    res.status(200).json({
        success: true,
        data: { accomodation, guests },
    });
}));
