"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const GuestSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
        type: String,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            'Please add a valid email',
        ],
    },
    slug: String,
    accomodation: {
        type: String,
        required: [true, 'Please add a accomodation'],
        enum: ['hotel', 'camping'],
    },
    attending: {
        type: String,
        required: [true, 'Please add attending'],
        enum: ['yes', 'no', 'maybe'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    fullDay: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// create guest slug from the name
GuestSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
exports.default = mongoose_1.default.model('Guest', GuestSchema);
