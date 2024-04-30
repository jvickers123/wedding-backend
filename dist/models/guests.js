"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const encryption_1 = require("../utils/encryption");
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
    encryptedEmail: {
        type: String,
    },
    slug: String,
    accomodation: {
        type: String,
    },
    attending: {
        type: String,
    },
    price: {
        type: Number,
    },
    fullDay: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    lunch: {
        type: String,
    },
    hotdog: {
        type: String,
    },
    dietryRequirements: {
        type: String,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// create guest slug from the name
GuestSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    if (!this.isModified('email')) {
        return next();
    }
    // add encrypted password
    this.encryptedEmail = (0, encryption_1.encryptEmail)(this.email);
    next();
});
GuestSchema.virtual('accomodationTents', {
    ref: 'Accomodation',
    localField: '_id',
    foreignField: 'guests',
    justOne: true,
});
GuestSchema.pre('find', function () {
    this.populate('accomodationTents');
});
exports.default = mongoose_1.default.model('Guest', GuestSchema);
