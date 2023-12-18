"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bootcamps_1 = require("../controllers/bootcamps");
const types_1 = require("../helpers/types");
const advancedResults_1 = require("../middleware/advancedResults");
const auth_1 = require("../middleware/auth");
const Bootcamp_1 = __importDefault(require("../models/Bootcamp"));
const courses_1 = __importDefault(require("./courses"));
const reviews_1 = __importDefault(require("./reviews"));
const router = (0, express_1.Router)();
// Reroute into other resourse routers
router.use('/:bootcampId/courses', courses_1.default);
router.use('/:bootcampId/reviews', reviews_1.default);
router
    .route('/')
    .get((0, advancedResults_1.advancedResults)(Bootcamp_1.default, 'courses'), bootcamps_1.getBootcamps)
    .post(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), bootcamps_1.createBootcamp);
router
    .route('/:id')
    .get(bootcamps_1.getSingleBootcamp)
    .put(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), bootcamps_1.updateBootcamp)
    .delete(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), bootcamps_1.deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(bootcamps_1.getBootcampsInRadius);
router
    .route('/:id/photo')
    .put(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), bootcamps_1.uploadPhotoForBootcamp);
exports.default = router;
