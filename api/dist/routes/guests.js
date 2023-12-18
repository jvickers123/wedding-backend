"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guests_1 = require("../controllers/guests");
const types_1 = require("../helpers/types");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router
    .route('/')
    .get(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), guests_1.getGuests)
    .post(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), guests_1.createGuests);
router
    .route('/:id')
    .get(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), guests_1.getSingleGuests)
    .put(guests_1.updateGuest)
    .delete(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), guests_1.deleteGuests);
exports.default = router;
