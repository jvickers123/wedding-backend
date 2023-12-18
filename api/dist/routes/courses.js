"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../controllers/courses");
const Course_1 = __importDefault(require("../models/Course"));
const auth_1 = require("../middleware/auth");
const advancedResults_1 = require("../middleware/advancedResults");
const types_1 = require("../helpers/types");
const router = (0, express_1.Router)({ mergeParams: true });
router
    .route('/')
    .get((0, advancedResults_1.advancedResults)(Course_1.default), courses_1.getCourses)
    .post(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), courses_1.createCourse);
router
    .route('/:courseId')
    .get(courses_1.getSingleCourse)
    .put(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), courses_1.updateCourse)
    .delete(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), courses_1.deleteCourse);
exports.default = router;
