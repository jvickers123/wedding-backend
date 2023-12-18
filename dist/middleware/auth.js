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
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const async_1 = require("./async");
const errorResponse_1 = require("../utils/errorResponse");
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("../models/User"));
// Protect routes
exports.protect = (0, async_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = '';
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token.length)
        throw new mongoose_1.Error('Not authorized to access this');
    try {
        // verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_1.default.findById(decoded.id);
        if (!user)
            throw new mongoose_1.Error.CastError('string', req.params.id, '_id');
        req.user = user;
        next();
    }
    catch (error) {
        throw new mongoose_1.Error('Not authorized to access this');
    }
}));
const authorize = (...roles) => (req, res, next) => {
    if (!req.user)
        return next();
    if (!roles.includes(req.user.role)) {
        throw new errorResponse_1.ErrorResponse(`User role ${req.user.role} is not authorised to access this route`, 403);
    }
    next();
};
exports.authorize = authorize;
