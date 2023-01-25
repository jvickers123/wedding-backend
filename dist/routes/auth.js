"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.route('/register').post(auth_1.registerUser);
router.route('/login').post(auth_1.loginUser);
router.route('/logout').get(auth_1.logoutUser);
router.route('/me').get(auth_2.protect, auth_1.getMe);
router.route('/updatedetails').put(auth_2.protect, auth_1.updateDetails);
router.route('/updatepassword').put(auth_2.protect, auth_1.updatePassword);
router.route('/forgotpassword').post(auth_1.forgotPassword);
router.route('/resetpassword/:resetToken').put(auth_1.resetPassword);
exports.default = router;
