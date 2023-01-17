"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("../controllers/reviews");
const advancedResults_1 = require("../middleware/advancedResults");
const Review_1 = __importDefault(require("../models/Review"));
const router = (0, express_1.Router)();
router.route('/').get((0, advancedResults_1.advancedResults)(Review_1.default, {
    path: 'bootcamp',
    select: 'name description',
}), reviews_1.getReviews);
exports.default = router;
