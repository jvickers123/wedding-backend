"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const all_1 = require("../controllers/all");
const types_1 = require("../helpers/types");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router
    .route('/')
    .get(auth_1.protect, (0, auth_1.authorize)(types_1.UserRole.PUBLISHER, types_1.UserRole.ADMIN), all_1.getGuestsAndAccomodation);
exports.default = router;
