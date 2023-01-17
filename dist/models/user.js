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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const types_1 = require("../helpers/types");
const crypto_1 = __importDefault(require("crypto"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
        required: [true, 'Please add an email'],
    },
    role: {
        type: String,
        enum: Object.values(types_1.UserRole),
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minLength: 6,
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    methods: {
        getSignedJWTToken() {
            return jsonwebtoken_1.default.sign({ id: this._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
        },
        matchPasswords(enteredPassword) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield bcryptjs_1.default.compare(enteredPassword, this.password);
            });
        },
        getResetPasswordToken() {
            const resetToken = crypto_1.default.randomBytes(20).toString('hex');
            this.resetPasswordToken = crypto_1.default
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
            return resetToken;
        },
    },
});
// Encrypt password
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        this.password = yield bcryptjs_1.default.hash(this.password, salt);
    });
});
exports.default = mongoose_1.default.model('User', UserSchema);
