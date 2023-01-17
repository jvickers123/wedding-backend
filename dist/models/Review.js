"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, 'Please add some text'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating'],
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bootcamp: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
});
exports.default = mongoose_1.default.model('Review', ReviewSchema);
