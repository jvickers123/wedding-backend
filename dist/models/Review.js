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
const Bootcamp_1 = __importDefault(require("./Bootcamp"));
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
}, {
    statics: {
        getAverageRating(bootcampId) {
            return __awaiter(this, void 0, void 0, function* () {
                const obj = yield this.aggregate([
                    {
                        $match: { bootcamp: bootcampId },
                    },
                    {
                        $group: {
                            _id: '$bootcamp',
                            averageRating: { $avg: '$rating' },
                        },
                    },
                ]);
                try {
                    yield Bootcamp_1.default.findByIdAndUpdate(bootcampId, {
                        averageRating: obj[0].averageRating,
                    });
                }
                catch (err) {
                    console.log(err);
                }
            });
        },
    },
});
ReviewSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.getAverageRating(this.bootcamp);
    });
});
ReviewSchema.pre('remove', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.getAverageRating(this.bootcamp);
    });
});
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Review', ReviewSchema);
