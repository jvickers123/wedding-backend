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
const CourseSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    weeks: {
        type: String,
        required: [true, 'Please add a description'],
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Bootcamp',
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    statics: {
        getAverageCost(bootcampId) {
            return __awaiter(this, void 0, void 0, function* () {
                const obj = yield this.aggregate([
                    {
                        $match: { bootcamp: bootcampId },
                    },
                    {
                        $group: {
                            _id: '$bootcamp',
                            averageCost: { $avg: '$tuition' },
                        },
                    },
                ]);
                try {
                    yield Bootcamp_1.default.findByIdAndUpdate(bootcampId, {
                        averageCost: Math.ceil(obj[0].averageCost),
                    });
                }
                catch (err) {
                    console.log(err);
                }
            });
        },
    },
});
CourseSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.getAverageCost(this.bootcamp);
    });
});
CourseSchema.pre('remove', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield this.constructor.getAverageCost(this.bootcamp);
    });
});
exports.default = mongoose_1.default.model('Course', CourseSchema);
