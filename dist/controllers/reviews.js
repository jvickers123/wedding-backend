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
exports.getReviews = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const async_1 = require("../middleware/async");
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
