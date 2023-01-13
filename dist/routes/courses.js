"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../controllers/courses");
const Course_1 = __importDefault(require("../models/Course"));
const advancedResults_1 = require("../middleware/advancedResults");
const router = (0, express_1.Router)({ mergeParams: true });
router.route('/').get((0, advancedResults_1.advancedResults)(Course_1.default), courses_1.getCourses).post(courses_1.createCourse);
router
    .route('/:courseId')
    .get(courses_1.getSingleCourse)
    .put(courses_1.updateCourse)
    .delete(courses_1.deleteCourse);
exports.default = router;
