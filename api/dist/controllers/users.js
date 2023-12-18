"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getSingleUsers = exports.getAllusers = void 0;
const async_1 = require("../middleware/async");
const User_1 = __importDefault(require("../models/User"));
/**
 * Get all users
 * @route GET api/v1/auth/users
 * @access private admin
 */
exports.getAllusers = (0, async_1.asyncHandler)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find();
    res.status(200).json({
        success: true,
        data: users,
    });
}));
/**
 * Get single user
 * @route GET api/v1/auth/users
 * @access private admin
 */
exports.getSingleUsers = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: user,
    });
}));
/**
 * Create user
 * @route POST api/v1/auth/users
 * @access private admin
 */
exports.createUser = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.create(req.body);
    res.status(201).json({
        success: true,
        data: user,
    });
}));
/**
 * Update User
 * @route POST api/v1/auth/users
 * @access private admin
 */
exports.updateUser = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: user,
    });
}));
/**
 * Delete User
 * @route Delete api/v1/auth/users
 * @access private admin
 */
exports.deleteUser = (0, async_1.asyncHandler)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: {},
    });
}));
