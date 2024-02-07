"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accomodation_1 = require("../controllers/accomodation");
const types_1 = require("../helpers/types");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router
    .route('/')
    .get(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), accomodation_1.getAllAccomodation)
    .post(accomodation_1.createAccomodation);
router
    .route('/:id')
    .get(accomodation_1.getSingleAccomodation)
    .put(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), accomodation_1.updateAccomodation)
    .delete(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), accomodation_1.deleteAccomodation);
exports.default = router;
