"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const types_1 = require("../helpers/types");
const advancedResults_1 = require("../middleware/advancedResults");
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
router.use(auth_1.protect);
router.use((0, auth_1.authorize)(types_1.UserRole.ADMIN));
router.route('/').get((0, advancedResults_1.advancedResults)(User_1.default), users_1.getAllusers).post(users_1.createUser);
router.route('/:id').get(users_1.getSingleUsers).put(users_1.updateUser).delete(users_1.deleteUser);
exports.default = router;
