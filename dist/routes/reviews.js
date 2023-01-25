"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("../controllers/reviews");
const types_1 = require("../helpers/types");
const advancedResults_1 = require("../middleware/advancedResults");
const auth_1 = require("../middleware/auth");
const Review_1 = __importDefault(require("../models/Review"));
const router = (0, express_1.Router)({ mergeParams: true });
router
    .route('/')
    .get((0, advancedResults_1.advancedResults)(Review_1.default, {
    path: 'bootcamp',
    select: 'name description',
}), reviews_1.getReviews)
    .post(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.USER), reviews_1.addReview);
router
    .route('/:reviewId')
    .get(reviews_1.getSingleReview)
    .put(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.USER), reviews_1.updateReview)
    .delete(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.ADMIN, types_1.UserRole.USER), reviews_1.deleteReview);
exports.default = router;
